package live.dolang.api.post.service.facade;

import live.dolang.api.post.service.PostBookmarkService;
import live.dolang.api.post.service.UserBookmarkService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class BookmarkFacadeService {

    private final UserBookmarkService userBookmarkService;
    private final PostBookmarkService postBookmarkService;

    @Transactional
    public void bookmarkPost(String userId, String postId) {
        userBookmarkService.setUserBookmark(userId, postId, true);
        postBookmarkService.incrementPostBookmarkCount(postId);
    }

    @Transactional
    public void unbookmarkPost(String userId, String postId) {
        userBookmarkService.setUserBookmark(userId, postId, false);
        postBookmarkService.decrementPostBookmarkCount(postId);
    }

    public Integer getPostBookmarkCount(String postId) {
        return postBookmarkService.getPostBookmarkCount(postId);
    }

    public Boolean getUserBookmark(String userId, String postId) {
        return userBookmarkService.getUserBookmark(userId, postId);
    }

    public Map<String, Boolean> getAllBookmarksForUser(String userId) {
        return userBookmarkService.getAllBookmarksForUser(userId);
    }
}
