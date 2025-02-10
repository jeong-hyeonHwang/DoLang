package live.dolang.api.post.controller;

import live.dolang.api.common.exception.NotFoundException;
import live.dolang.api.common.response.BaseResponse;
import live.dolang.api.common.response.BaseResponseStatus;
import live.dolang.api.post.dto.BookmarkStatusDto;
import live.dolang.api.post.service.CustomDateSentenceService;
import live.dolang.api.post.service.CustomUserDateSentenceService;
import live.dolang.api.post.service.facade.BookmarkFacadeService;
import live.dolang.core.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/post")
@RequiredArgsConstructor
public class PostController {

    private final UserService userService;
    private final CustomDateSentenceService customDatesentenceService;
    private final CustomUserDateSentenceService customUserDateSentenceService;
    private final BookmarkFacadeService bookmarkFacadeService;

    /**
     * 북마크 추가
     * @param feedId: 발음 문장 아이디
     * @param postId: 사용자가 발음한 문장 아이디
     */
    @PostMapping("{feedId}/{postId}/bookmark")
    public BaseResponse<BookmarkStatusDto> bookmarkPost(@AuthenticationPrincipal Jwt jwt,
                                        @PathVariable Integer feedId,
                                        @PathVariable Integer postId) {
        Integer userId = Integer.parseInt(jwt.getId());
        if (!userService.isUserExists(userId)) {
            throw new NotFoundException(BaseResponseStatus.NOT_EXIST_USER);
        }

        if (customDatesentenceService.isDateSentenceExists(feedId)) {
            throw new NotFoundException(BaseResponseStatus.NOT_EXIST_FEED);
        }
        if (customUserDateSentenceService.isUserDateSentenceExists(postId)) {
            throw new NotFoundException(BaseResponseStatus.NOT_EXIST_POST);
        }

        BookmarkStatusDto bookmarkStatusDto = bookmarkFacadeService.bookmarkUserDateSentence(userId, feedId, postId);
        return new BaseResponse<>(bookmarkStatusDto);
    }
}
