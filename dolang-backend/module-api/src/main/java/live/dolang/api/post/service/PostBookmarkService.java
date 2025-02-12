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
            String sortedKey = getFeedBookmarkSortedKey(hashKey);
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
    public Integer getPostBookmarkCount(Integer feedId, Integer postId) {
        String hashKey = getFeedBookmarkKey(feedId);

        Integer count = (Integer) hashOperations.get(hashKey, postId.toString());

        if (count == null) {
            // 데이터가 없으면 DB에서 전체 복구
            recoverAllPostBookmarkCountsFromDB();
            // 다시 조회
            count = (Integer) hashOperations.get(hashKey, postId.toString());

            // 그래도 null이면 (=DB에 해당 postId가 없다고 간주)
            if (count == null) {
                count = 0; // 기본값 0
                // 해시에 정수만 put
                hashOperations.put(hashKey, postId.toString(), count);

                // Sorted Set에도 0으로 추가
                String sortedKey = getFeedBookmarkSortedKey(hashKey);
                zSetOperations.add(sortedKey, postId.toString(), 0);
            }
        }

        return count;
    }

    /**
     * 특정 피드의 특정 포스트 북마크 수 1 증가 (Hash와 Sorted Set 모두 업데이트)
     */
    public void incrementPostBookmarkCount(Integer feedId, Integer postId) {
        String hashKey = getFeedBookmarkKey(feedId);
        getPostBookmarkCount(feedId, postId);

        // Hash 업데이트
        hashOperations.increment(hashKey, postId.toString(), 1);
        // Sorted Set 업데이트
        String sortedKey = getFeedBookmarkSortedKey(hashKey);

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
        String sortedKey = getFeedBookmarkSortedKey(hashKey);
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
    private String getFeedBookmarkSortedKey(String hashKey) {
        return hashKey + ":sorted";
    }
}
