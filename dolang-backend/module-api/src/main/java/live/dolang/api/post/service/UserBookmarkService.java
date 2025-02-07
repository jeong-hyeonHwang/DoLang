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
    private String userBookmarkPrefix;

    @Value("${spring.data.redis.bookmark.postfix}")
    private String bookmarkPostfix;

    private final RedisTemplate<String, Object> redisTemplate;
    private final HashOperations<String, String, BookmarkDataDto> bookmarkHashOperations;
    private final CustomUserSentenceBookmarkLogRepository customUserSentenceBookmarkLogRepository;

    /**
     * 북마크 등록 또는 해제 메서드 (dirty 플래그 사용)
     *
     * @param userId 사용자 ID
     * @param userSentenceId 북마크할 Sentence ID
     * @return 최종 북마크 상태 (true: 등록, false: 해제)
     */
    public boolean setUserBookmark(Integer userId, Integer userSentenceId) {
        // 메인 데이터 key와 필드 구성
        String dataKey = getDataKey(userId);
        String field = userSentenceId.toString();
        // dirty 플래그용 key 구성 (예: "user:123:bookmarks:dirty")
        String dirtySetKey = getDirtySetKey(userId);

        long timestamp = Instant.now().getEpochSecond();

        // Redis에서 기존 데이터 조회
        BookmarkDataDto currentData = bookmarkHashOperations.get(dataKey, field);
        boolean currentBookmarkStatus;

        // Redis에 값이 없으면 DB에서 조회
        if (currentData == null) {
            currentBookmarkStatus = isBookmarked(userId, userSentenceId);
        } else {
            currentBookmarkStatus = currentData.isBookmarked();
        }

        // 토글 방식: 기존 상태의 반대로 변경
        boolean newBookmarkStatus = !currentBookmarkStatus;
        BookmarkDataDto newData = new BookmarkDataDto(newBookmarkStatus, timestamp);

        // 메인 해시 업데이트
        bookmarkHashOperations.put(dataKey, field, newData);
        // 변경된 항목을 dirty 세트에 추가하여 변경됨을 표시
        redisTemplate.opsForSet().add(dirtySetKey, field);

        // 만료 시간 설정 (예: 1일)
        redisTemplate.expire(dataKey, Duration.ofDays(1));
        redisTemplate.expire(dirtySetKey, Duration.ofDays(1));

        return newBookmarkStatus;
    }

    /**
     * 특정 Sentence의 북마크 여부 조회 메서드
     * Redis에 값이 있으면 반환, 없으면 DB 조회
     */
    private boolean isBookmarked(Integer userId, Integer userSentenceId) {
        String dataKey = getDataKey(userId);
        String field = userSentenceId.toString();
        BookmarkDataDto data = bookmarkHashOperations.get(dataKey, field);
        if (data != null) {
            return data.isBookmarked();
        }
        return customUserSentenceBookmarkLogRepository.getLatestBookmarkYn(userId, userSentenceId);
    }

    private String getDataKey(Integer userId) {
        return userBookmarkPrefix + userId + bookmarkPostfix;
    }

    private String getDirtySetKey(Integer userId) {
        return getDataKey(userId) + ":dirty";
    }
}