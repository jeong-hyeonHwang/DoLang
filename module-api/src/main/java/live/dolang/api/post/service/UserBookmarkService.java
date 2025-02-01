package live.dolang.api.post.service;

import live.dolang.core.domain.userSentenceBookmarkLog.UserSentenceBookmarkLog;
import live.dolang.core.domain.userSentenceBookmarkLog.repository.UserSentenceBookmarkLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.*;

@Service
@RequiredArgsConstructor
public class UserBookmarkService {

    @Value("${spring.data.redis.user.prefix}")
    private String userBookmarkPrefix;

    @Value("${spring.data.redis.bookmark.postfix}")
    private String userBookmarkPostfix;

    private final RedisTemplate<String, Object> redisTemplate;
    private final HashOperations<String, String, Boolean> hashOperations;
    private final UserSentenceBookmarkLogRepository userSentenceBookmarkLogRepository;

    public void setUserBookmark(String userId, String postId, Boolean bookmark) {
        String key = getPostBookmarkKey(userId);
        hashOperations.put(key, postId, bookmark);
        redisTemplate.expire(key, Duration.ofDays(1));
    }

    public Boolean getUserBookmark(String userId, String postId) {
        String key = getPostBookmarkKey(userId);

        Boolean bookmark = hashOperations.get(key, postId);

        if (bookmark == null) {
            Integer parsedUserId = Integer.parseInt(userId);
            Integer parsedPostId = Integer.parseInt(postId);

            Optional<UserSentenceBookmarkLog> optionalLog = userSentenceBookmarkLogRepository
                    .findByUser_IdAndUserDateSentence_UserDateSentenceId(parsedUserId, parsedPostId);
            if(optionalLog.isPresent()) {
                bookmark = optionalLog.get().isBookmarkYn();
            } else {
                bookmark = false; // 기본값 설정
            }
            hashOperations.put(key, postId, bookmark);
        }

        return bookmark;
    }

    public Map<String, Boolean> getAllBookmarksForUser(String userId) {
        String key = getPostBookmarkKey(userId);

        Map<String, Boolean> bookmarks = hashOperations.entries(key);

        if (bookmarks.isEmpty()) {
            Integer parsedUserId = Integer.parseInt(userId);
            List<UserSentenceBookmarkLog> bookmarkLogs = userSentenceBookmarkLogRepository.findByUser_Id(parsedUserId);
            if (bookmarkLogs != null && !bookmarkLogs.isEmpty()) {
                bookmarks = new HashMap<>();
                for (UserSentenceBookmarkLog log : bookmarkLogs) {
                    String postId = log.getUserDateSentence().getUserDateSentenceId().toString();
                    Boolean likeYn = log.isBookmarkYn();
                    bookmarks.put(postId, likeYn);
                }
                hashOperations.putAll(key, bookmarks);
            } else {
                bookmarks = Collections.emptyMap();
            }
        }

        return bookmarks;
    }

    private String getPostBookmarkKey(String postId) {
        return userBookmarkPrefix + postId + userBookmarkPostfix;
    }
}