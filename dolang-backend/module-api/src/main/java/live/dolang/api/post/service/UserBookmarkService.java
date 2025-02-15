package live.dolang.api.post.service;

import live.dolang.api.post.dto.BookmarkDataDto;
import live.dolang.api.post.repository.CustomUserSentenceBookmarkLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class UserBookmarkService {

    @Value("${spring.data.redis.user.prefix}")
    private String userPrefix;

    @Value("${spring.data.redis.feed.prefix}")
    private String feedPrefix;
    @Value("${spring.data.redis.bookmark.postfix}")
    private String bookmarkPostfix;

    private final RedisTemplate<String, Object> redisTemplate;
    private final HashOperations<String, Integer, BookmarkDataDto> bookmarkHashOperations;
    private final CustomUserSentenceBookmarkLogRepository customUserSentenceBookmarkLogRepository;

    /**
     * 북마크 등록 또는 해제 메서드 (dirty 플래그 사용)
     *
     * @param userId 사용자 ID
     * @param feedId 북마크할 Sentence ID (DateSentence)
     * @param postId 북마크할 Sentence ID (UserDateSentence)
     * @return 최종 북마크 상태 (true: 등록, false: 해제)
     */
    public boolean setUserBookmark(Integer userId, Integer feedId, Integer postId) {
        // 사용자와 피드 ID를 함께 사용하여 데이터 key와 필드 구성
        String dataKey = getDataKey(userId, feedId);
        // dirty 플래그용 key 구성 (예: "user:123:feed:456:bookmark:dirty")
        String dirtySetKey = getDirtySetKey(userId, feedId);

        long timestamp = Instant.now().getEpochSecond();

        // Redis에서 기존 데이터 조회
        BookmarkDataDto currentData = bookmarkHashOperations.get(dataKey, postId);
        boolean currentBookmarkStatus;

        // Redis에 값이 없으면 DB에서 조회
        if (currentData == null) {
            currentBookmarkStatus = isBookmarked(userId, feedId, postId);
        } else {
            currentBookmarkStatus = currentData.isBookmarked();
        }

        // 토글 방식: 기존 상태의 반대로 변경
        boolean newBookmarkStatus = !currentBookmarkStatus;
        BookmarkDataDto newData = new BookmarkDataDto(newBookmarkStatus, timestamp);

        // 메인 해시 업데이트
        bookmarkHashOperations.put(dataKey, feedId, newData);
        // 변경된 항목을 dirty 세트에 추가하여 변경됨을 표시
        redisTemplate.opsForSet().add(dirtySetKey, feedId);

        // 만료 시간 설정 (예: 1일)
        redisTemplate.expire(dataKey, Duration.ofDays(1));
        redisTemplate.expire(dirtySetKey, Duration.ofDays(1));

        return newBookmarkStatus;
    }

    /**
     * 특정 포스트의 북마크 여부 조회 메서드
     * Redis에 값이 있으면 반환, 없으면 DB 조회
     */
    public boolean isBookmarked(Integer userId, Integer feedId, Integer postId) {
        String dataKey = getDataKey(userId, feedId);
        String field = postId.toString();
        BookmarkDataDto data = bookmarkHashOperations.get(dataKey, field);
        if (data != null) {
            return data.isBookmarked();
        }
        return customUserSentenceBookmarkLogRepository.getLatestBookmarkYn(userId, feedId, postId);
    }

    /**
     * 사용자와 피드 ID를 포함한 Redis 데이터 key 생성
     * 예: "user:123:feed:456:bookmark"
     */
    private String getDataKey(Integer userId, Integer feedId) {
        return userPrefix + ":" +
                userId + ":" +
                feedPrefix + ":" +
                feedId + ":" +
                bookmarkPostfix;
    }
    /**
     * dirty 플래그를 위한 key 생성
     * 예: "user:123:feed:456:bookmark:dirty"
     */
    private String getDirtySetKey(Integer userId, Integer feedId) {
        return getDataKey(userId, feedId) + ":dirty";
    }
}