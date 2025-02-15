package live.dolang.api.myfeed.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import live.dolang.api.common.response.BaseResponse;
import live.dolang.api.myfeed.dto.LikedFeedParticipantsResponseDto;
import live.dolang.api.myfeed.dto.ResponseLikedFeedDto;
import live.dolang.api.myfeed.service.MyFeedService;
import live.dolang.api.post.dto.ResponseFeedDto;
import live.dolang.api.post.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@Tag(name = "나의 피드")
@RestController
@RequestMapping("/api/myfeed")
@RequiredArgsConstructor
public class MyFeedController {

    private final MyFeedService feedService;
    private final PostService postService;

    /**
     * 나의 피드목록 가져오기
     */
    @GetMapping
    @Operation(
            summary = "나의 피드목록 가져오기",
            description = "현재 로그인된 사용자의 피드 목록을 조회합니다.",
            security = @SecurityRequirement(name = "BearerAuth") // JWT 인증 적용
    )
    public BaseResponse<Page<ResponseFeedDto>> getMyfeedList(@AuthenticationPrincipal Jwt jwt,
                                                             @RequestParam(value = "lang", required = false)String lang,
                                                             @PageableDefault(size = 5, sort = "dateId", direction = Sort.Direction.DESC) Pageable pageable) {
        int userId = Integer.parseInt(jwt.getId());
        Page<ResponseFeedDto> list = postService.getMyFeedList(userId, lang, pageable);
        return BaseResponse.ok(list);
    }

    /**
     * 나의 북마크/좋아요 피드목록 가져오기
     */
    @GetMapping("/liked")
    @Operation(
            summary = "나의 북마크/좋아요 피드목록 가져오기",
            description = "현재 로그인된 사용자가 좋아요/북마크한 피드 목록을 조회합니다.",
            security = @SecurityRequirement(name = "BearerAuth") // JWT 인증 적용
    )
    public BaseResponse<Page<ResponseLikedFeedDto>> getMyLikedFeedList(@AuthenticationPrincipal Jwt jwt,
                                                             @RequestParam(value = "lang", required = false)String lang,
                                                             @PageableDefault(size = 5, sort = "dateId", direction = Sort.Direction.DESC) Pageable pageable) {
        int userId = Integer.parseInt(jwt.getId());
        Page<ResponseLikedFeedDto> list = postService.getMyLikedFeedList(userId, lang, pageable);
        return BaseResponse.ok(list);
    }

    @GetMapping("liked/{feedId}")
    @Operation(
            summary = "나의 북마크/좋아요 상세 포스트 목록 조회",
            description = "특정 피드에서 내가 북마크/좋아요한 상세 포스트 목록을 조회합니다.",
            security = @SecurityRequirement(name = "BearerAuth")
    )
    public BaseResponse<LikedFeedParticipantsResponseDto> getMyLikedPostList(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable(value = "feedId") Integer feedId,
            @RequestParam(value = "length", defaultValue = "5") Integer length,
            @RequestParam(value = "nextCursor", required = false) String nextCursor) {
        Integer userId = jwt == null ? null : Integer.parseInt(jwt.getId());
        
        LikedFeedParticipantsResponseDto list = feedService.getMyLikedParticipantsList(userId, feedId, length, nextCursor);

        return BaseResponse.ok(list);
    }
}