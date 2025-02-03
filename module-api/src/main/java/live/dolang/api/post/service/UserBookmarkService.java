package live.dolang.api.post.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class UserBookmarkService {

    @Value("${spring.data.redis.user.prefix}")
    private String userBookmarkPrefix;

    @Value("${spring.data.redis.bookmark.postfix}")
    private String userBookmarkPostfix;

    private final RedisTemplate<String, Object> redisTemplate;
    private final HashOperations<String, String, Boolean> hashOperations;

    public void setUserBookmark(Integer userId, Integer userSentenceId, Boolean bookmark) {
        String key = getUserSentenceBookmarkKey(userId);
        String parsedUserSentenceId = Integer.toString(userSentenceId);
        hashOperations.put(key, parsedUserSentenceId, bookmark);
        redisTemplate.expire(key, Duration.ofDays(1));
    }

    private String getUserSentenceBookmarkKey(Integer userSentenceId) {
        return userBookmarkPrefix + userSentenceId + userBookmarkPostfix;
    }
}