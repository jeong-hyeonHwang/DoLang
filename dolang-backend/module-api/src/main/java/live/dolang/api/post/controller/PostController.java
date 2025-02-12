package live.dolang.api.post.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import live.dolang.api.common.exception.NotFoundException;
import live.dolang.api.common.response.BaseResponse;
import live.dolang.api.common.response.BaseResponseStatus;
import live.dolang.api.post.dto.BookmarkStatusDto;
import live.dolang.api.post.service.CustomDateSentenceService;
import live.dolang.api.post.service.CustomUserDateSentenceService;
import live.dolang.api.post.service.PostService;
import live.dolang.api.post.service.facade.BookmarkFacadeService;
import live.dolang.core.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Tag(name = "2. POST")
@RestController
@RequestMapping("/api/post")
@RequiredArgsConstructor
public class PostController {

    private final UserService userService;
    private final CustomDateSentenceService customDateSentenceService;
    private final CustomUserDateSentenceService customUserDateSentenceService;
    private final BookmarkFacadeService bookmarkFacadeService;
    private final PostService postService;

    /**
     * 북마크 추가
     *
     * @param feedId: 발음 문장 아이디
     * @param postId: 사용자가 발음한 문장 아이디
     */
    @Operation(
            summary = "북마크 추가",
            security = @SecurityRequirement(name = "BearerAuth")
    )
    @PostMapping("{feedId}/{postId}/bookmark")
    public BaseResponse<BookmarkStatusDto> bookmarkPost(@AuthenticationPrincipal Jwt jwt,
                                                        @PathVariable Integer feedId,
                                                        @PathVariable Integer postId) {
        Integer userId = Integer.parseInt(jwt.getId());
        if (!userService.isUserExists(userId)) {
            throw new NotFoundException(BaseResponseStatus.NOT_EXIST_USER);
        }

        if (customDateSentenceService.isDateSentenceExists(feedId)) {
            throw new NotFoundException(BaseResponseStatus.NOT_EXIST_FEED);
        }
        if (customUserDateSentenceService.isUserDateSentenceExists(postId)) {
            throw new NotFoundException(BaseResponseStatus.NOT_EXIST_POST);
        }

        BookmarkStatusDto bookmarkStatusDto = bookmarkFacadeService.bookmarkUserDateSentence(userId, feedId, postId);
        return BaseResponse.ok(bookmarkStatusDto);
    }


    @PostMapping("{feedId}/upload")
    public BaseResponse<BaseResponseStatus> uploadTest(@RequestPart("file") MultipartFile file,
                                                       @AuthenticationPrincipal Jwt jwt,
                                                       @PathVariable Integer feedId) throws IllegalAccessException {
        Integer userId = Integer.parseInt(jwt.getId());
        String fileUrl = customUserDateSentenceService.uploadTest(file);
        System.out.println("결과 : " + fileUrl);
        postService.createUserDateSentence(userId, feedId, fileUrl);
        return BaseResponse.ok();
    }

    //S3업로드 테스트 API
    @Operation(
            hidden = true
    )
    @PostMapping("/uploadTest")
    public BaseResponse<BaseResponseStatus> uploadTest(@RequestPart("file") MultipartFile file) throws IllegalAccessException {
        long start = System.currentTimeMillis();
        String fileUrl = customUserDateSentenceService.uploadTest(file);
        long end = System.currentTimeMillis();
        System.out.println("결과 : " + fileUrl);
        System.out.println("걸린 시간 :" + (end - start));
        return BaseResponse.ok();
    }
}
