package live.dolang.api.post.service.facade;

import live.dolang.api.post.service.PostBookmarkService;
import live.dolang.api.post.service.UserBookmarkService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BookmarkFacadeService {

    private final UserBookmarkService userBookmarkService;
    private final PostBookmarkService postBookmarkService;

    @Transactional
    public void bookmarkUserDateSentence(Integer userId, Integer userDateSentenceId) {
        userBookmarkService.setUserBookmark(userId, userDateSentenceId, true);
        postBookmarkService.incrementPostBookmarkCount(userDateSentenceId);
    }

    @Transactional
    public void unbookmarkUserDateSentence(Integer userId, Integer userDateSentenceId) {
        userBookmarkService.setUserBookmark(userId, userDateSentenceId, false);
        postBookmarkService.decrementPostBookmarkCount(userDateSentenceId);
    }
}
