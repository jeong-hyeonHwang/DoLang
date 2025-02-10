package live.dolang.api.post.service;

import jakarta.annotation.PostConstruct;
import live.dolang.api.post.dto.BookmarkCountDTO;
import live.dolang.api.post.repository.CustomUserSentenceBookmarkLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PostBookmarkService {

    @Value("${spring.data.redis.feed.prefix}")
    private String feedPrefix;

    @Value("${spring.data.redis.bookmark.postfix}")
    private String userSentenceBookmarkCountPrefix;

    @Value("${spring.data.redis.count.postfix}")
    private String userSentenceBookmarkCountPostfix;

    // 기존 Hash를 통한 관리
    private final RedisTemplate<String, Object> redisTemplate;
    private HashOperations<String, Object, Object> hashOperations;

    // 정렬 조회를 위한 Sorted Set 사용
    private ZSetOperations<String, Object> zSetOperations;

    private final CustomUserSentenceBookmarkLogRepository userSentenceBookmarkLogRepository;

    @PostConstruct
    public void init() {
        hashOperations = redisTemplate.opsForHash();
        zSetOperations = redisTemplate.opsForZSet();
    }

    /**
     * DB 풀 스캔으로 게시글별 북마크 수 조회 후,
     * 피드별로 Redis의 Hash와 Sorted Set에 동시에 저장.
     */
    public void recoverAllPostBookmarkCountsFromDB() {
        List<BookmarkCountDTO> bookmarkCountList = getAllPostBookmarkCounts();

        // 피드별로 저장할 해시 및 sorted set 데이터를 준비
        Map<String, Map<Object, Object>> feedHashMap = new HashMap<>();

        for (BookmarkCountDTO dto : bookmarkCountList) {
            String feedKey = getFeedBookmarkKey(dto.getFeedId());
            feedHashMap.computeIfAbsent(feedKey, k -> new HashMap<>())
                    .put(dto.getPostId().toString(), dto.getBookmarkCount());
        }

        // 각 피드별로 Redis 해시와 Sorted Set에 저장 (TTL은 미설정: 영구 보관)
        for (Map.Entry<String, Map<Object, Object>> entry : feedHashMap.entrySet()) {
            String hashKey = entry.getKey();
            Map<Object, Object> hashData = entry.getValue();
            // Hash에 저장
            hashOperations.putAll(hashKey, hashData);

            // Sorted Set에 저장: key는 별도로 생성 (예, 기존 key에 ":sorted" 접미사를 추가)
            String sortedKey = getFeedBookmarkSortedKey(getFeedIdFromKey(hashKey));
            for (Map.Entry<Object, Object> e : hashData.entrySet()) {
                // score는 북마크 수(Double 타입)로 변환
                double score = Double.parseDouble(e.getValue().toString());
                zSetOperations.add(sortedKey, e.getKey(), score);
            }
        }
    }

    /**
     * 특정 피드의 특정 포스트 북마크 수 조회
     * - Redis에 값이 없으면 DB에서 전체 복구 후 값 반환
     */
    public void getPostBookmarkCount(Integer feedId, Integer postId) {
        String hashKey = getFeedBookmarkKey(feedId);
        Object countObj = hashOperations.get(hashKey, postId.toString());

        if (countObj == null) {
            recoverAllPostBookmarkCountsFromDB();
            countObj = hashOperations.get(hashKey, postId.toString());
            if (countObj == null) {
                countObj = 0L;
                hashOperations.put(hashKey, postId.toString(), countObj);
                // Sorted Set에도 추가
                String sortedKey = getFeedBookmarkSortedKey(feedId);
                zSetOperations.add(sortedKey, postId.toString(), 0);
            }
        }
    }

    /**
     * 특정 피드의 특정 포스트 북마크 수 1 증가 (Hash와 Sorted Set 모두 업데이트)
     */
    public void incrementPostBookmarkCount(Integer feedId, Integer postId) {
        String hashKey = getFeedBookmarkKey(feedId);
        if (hashOperations.get(hashKey, postId.toString()) == null) {
            // 값이 없으면 먼저 복구
            getPostBookmarkCount(feedId, postId);
        }
        // Hash 업데이트
        hashOperations.increment(hashKey, postId.toString(), 1);
        // Sorted Set 업데이트
        String sortedKey = getFeedBookmarkSortedKey(feedId);

        zSetOperations.incrementScore(sortedKey, postId.toString(), 1);
    }

    // 특정 피드의 특정 포스트 북마크 수 1 감소 (Hash와 Sorted Set 모두 업데이트)
    public void decrementPostBookmarkCount(Integer feedId, Integer postId) {
        String hashKey = getFeedBookmarkKey(feedId);
        if (hashOperations.get(hashKey, postId.toString()) == null) {
            getPostBookmarkCount(feedId, postId);
        }
        // Hash 업데이트
        hashOperations.increment(hashKey, postId.toString(), -1);
        // Sorted Set 업데이트
        String sortedKey = getFeedBookmarkSortedKey(feedId);
        zSetOperations.incrementScore(sortedKey, postId.toString(), -1);
    }

    private List<BookmarkCountDTO> getAllPostBookmarkCounts() {
        return userSentenceBookmarkLogRepository.findAllPostBookmarkCountsRaw();
    }

    // Hash 자료구조에 사용될 피드별 key 생성
    private String getFeedBookmarkKey(Integer feedId) {
        return feedPrefix + ":" +
                userSentenceBookmarkCountPrefix + ":" +
                feedId + ":" + userSentenceBookmarkCountPostfix;
    }

    /**
     * Sorted Set에 사용될 key 생성
     * 기존 해시 key와는 별개로, ":sorted" 접미사를 붙여 구분
     */
    private String getFeedBookmarkSortedKey(Integer feedId) {
        return getFeedBookmarkKey(feedId) + ":sorted";
    }

    /**
     * 해시 key에서 피드 아이디를 추출하는 헬퍼 메서드 (필요에 따라 구현)
     */
    private Integer getFeedIdFromKey(String key) {
        // 예시: key가 "feed:bookmark:123:count" 형태라면, "123"을 추출
        String withoutPrefix = key.replace(feedPrefix + userSentenceBookmarkCountPrefix, "");
        String idStr = withoutPrefix.split(userSentenceBookmarkCountPostfix)[0];
        return Integer.valueOf(idStr);
    }
}
