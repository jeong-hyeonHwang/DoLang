package live.dolang.api.feed.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import live.dolang.api.common.enums.SortType;
import live.dolang.api.common.response.BaseResponse;
import live.dolang.api.feed.dto.FeedParticipantsResponseDto;
import live.dolang.api.feed.dto.TodayFeedResponseDto;
import live.dolang.api.feed.service.FeedService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "오늘의 피드")
@RestController
@RequestMapping("/api/feed")
@RequiredArgsConstructor
public class FeedController {

    private final FeedService feedService;

    @Operation(
            summary = "피드 정보 조회",
            description = "UTC를 기준으로 오늘의 피드에 해당하는 데이터를 조회합니다.\n비회원인 경우에도 접근 가능합니다.\n",
            security = @SecurityRequirement(name = "BearerAuth") // JWT 인증 적용
    )
    @GetMapping("/today")
    public BaseResponse<TodayFeedResponseDto> getTodayPost(@AuthenticationPrincipal Jwt jwt,
                                                           @RequestParam(value = "lang", defaultValue = "ko")String lang,
                                                           @RequestParam(value = "langLevel", defaultValue = "B1")String langLevel) {
        Integer userId = jwt == null ? null : Integer.parseInt(jwt.getId());
        TodayFeedResponseDto dto = feedService.getTodayFeed(userId, lang, langLevel);
        return BaseResponse.ok(dto);
    }


    @Operation(
            summary = "피드 사용자 참여 리스트 조회",
            description = "오늘의 피드에 참여한 사용자의 데이터를 조회합니다\n비회원인 경우에도 접근 가능합니다.\n",
            security = @SecurityRequirement(name = "BearerAuth") // JWT 인증 적용
    )
    @GetMapping("/today/participants")
    public BaseResponse<FeedParticipantsResponseDto> getTodayFeedParticipants(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(value = "feedId") Integer feedId,
            @RequestParam(value = "sort", defaultValue = "LATEST") String sort,
            @RequestParam(value = "length", defaultValue = "5") Integer length,
            @RequestParam(value = "nextCursor", required = false) String nextCursor
    ) {
        Integer userId = jwt == null ? null : Integer.parseInt(jwt.getId());
        FeedParticipantsResponseDto dto = feedService.getTodayFeedParticipants(userId, feedId, SortType.valueOf(sort), length, nextCursor);
        return BaseResponse.ok(dto);
    }
}