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
         * 북마크 등록 또는 해제 메서드
         * @param userId 사용자 ID
         * @param userSentenceId 북마크할 Sentence ID
         * @return 북마크 상태값 반환
         */
        public boolean setUserBookmark(Integer userId, Integer userSentenceId) {
            String dataKey = getDataKey(userId);
            String field = userSentenceId.toString();
            long timestamp = Instant.now().getEpochSecond();

            boolean isBookmarked = !isBookmarked(userId, userSentenceId);
            BookmarkDataDto data = new BookmarkDataDto(isBookmarked, timestamp);
            bookmarkHashOperations.put(dataKey, field, data);

            redisTemplate.expire(dataKey, Duration.ofDays(1));

            return isBookmarked;
        }

        /**
         * 특정 Sentence가 북마크 되어 있는지 여부를 조회
         * Redis에 데이터가 있으면 바로 반환하고, 없으면 DB를 조회하도록 구현하면 됨.
         */
        public boolean isBookmarked(Integer userId, Integer userSentenceId) {
            String dataKey = getDataKey(userId);
            String field = userSentenceId.toString();
            BookmarkDataDto data = bookmarkHashOperations.get(dataKey, field);
            if (data != null) {
                return data.isBookmarked();
            }

            // Redis에 특정 Sentence 북마크 정보가 없을 경우 DB에서 조회 후 값 반환
            return customUserSentenceBookmarkLogRepository.getLatestBookmarkYn(userId, userSentenceId);
        }

        private String getDataKey(Integer userId) {
            return userBookmarkPrefix + userId + bookmarkPostfix;
        }
}