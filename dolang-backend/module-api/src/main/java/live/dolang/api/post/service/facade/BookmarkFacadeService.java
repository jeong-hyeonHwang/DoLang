package live.dolang.api.post.service.facade;

import live.dolang.api.post.dto.BookmarkStatusDto;
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
    public BookmarkStatusDto bookmarkUserDateSentence(Integer userId, Integer feedId, Integer postId) {
        boolean isBookmarked = userBookmarkService.setUserBookmark(userId, feedId, postId);
        if (isBookmarked) {
            postBookmarkService.incrementPostBookmarkCount(feedId, postId);
        } else {
            postBookmarkService.decrementPostBookmarkCount(feedId, postId);
        }
        return new BookmarkStatusDto(isBookmarked);
    }
}
