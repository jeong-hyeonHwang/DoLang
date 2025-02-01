package live.dolang.api.post.service;

import com.querydsl.core.Tuple;
import live.dolang.api.post.dto.BookmarkCountDTO;
import live.dolang.core.domain.userSentenceBookmarkLog.repository.UserSentenceBookmarkLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostBookmarkService {

    @Value("${spring.data.redis.post.prefix}")
    private String postBookmarkCountPrefix;

    @Value("${spring.data.redis.bookmark.count.postfix}")
    private String postBookmarkCountPostfix;

    private final RedisTemplate<String, Object> redisTemplate;
    private final ValueOperations<String, Object> valueOperations;
    private final UserSentenceBookmarkLogRepository userSentenceBookmarkLogRepository;

    /**
     * 1) Redis에 카운트 키가 없으면 -> DB 풀 스캔 (findAllPostLikeCounts)
     * 2) 게시글별로 키 생성 & Redis에 영구 저장(만료 없음)
     */
    public void recoverAllPostBookmarkCountsFromDB() {
        // DB 풀 스캔으로 게시글별 좋아요 수 조회
        List<BookmarkCountDTO> likeCountList = getAllPostBookmarkCounts();

        // 조회 결과를 Redis에 저장 (키가 없다면 새로 만듦)
        for (BookmarkCountDTO dto : likeCountList) {
            String key = getPostBookmarkKey(dto.getPostId().toString());
            // 영구 보관 -> TTL 미설정
            valueOperations.set(key, dto.getBookmarkCount());
        }
    }

    /**
     * Redis에 게시글 북마크 카운트가 있는지 확인 -> 없으면 recoverAllPostBookmarkCountsFromDB()
     */
    public Integer getPostBookmarkCount(String postId) {
        String key = getPostBookmarkKey(postId);
        Object bookmarkCount = valueOperations.get(key);

        if (bookmarkCount == null) {
            // 극히 드문 케이스: Redis 장애 등으로 키가 전부 사라진 상황
            recoverAllPostBookmarkCountsFromDB();
            // 다시 읽기
            bookmarkCount = valueOperations.get(key);
            // 여전히 null일 수 있으므로 0 처리
            if (bookmarkCount == null) {
                bookmarkCount = 0L;
                valueOperations.set(key, bookmarkCount);
            }
        }
        return ((Number) bookmarkCount).intValue();
    }

    /**
     * Redis에 이미 게시글 카운트가 저장되어 있다고 가정 -> 값만 증가
     * 만약(매우 드물게) 키가 없으면 getPostBookmarkCount()로 fallback
     */
    public void incrementPostBookmarkCount(String postId) {
        String key = getPostBookmarkKey(postId);
        if (valueOperations.get(key) == null) {
            // Redis 키가 없으면 전체 초기화 후 다시 카운트 가져오기
            getPostBookmarkCount(postId);
        }
        // 이제 키가 있다고 가정 -> +1
        valueOperations.increment(key, 1);
    }

    public void decrementPostBookmarkCount(String postId) {
        String key = getPostBookmarkKey(postId);
        if (valueOperations.get(key) == null) {
            getPostBookmarkCount(postId);
        }
        valueOperations.increment(key, -1);
    }

    private List<BookmarkCountDTO> getAllPostBookmarkCounts() {
        List<Tuple> results = userSentenceBookmarkLogRepository.findAllPostBookmarkCountsRaw();

        return results.stream()
                .map(tuple -> new BookmarkCountDTO(
                        tuple.get(0, Number.class).intValue(),
                        tuple.get(1, Number.class).intValue()
                ))
                .collect(Collectors.toList());
    }

    private String getPostBookmarkKey(String postId) {
        return postBookmarkCountPrefix + postId + postBookmarkCountPostfix;
    }
}
