package live.dolang.api.feed.controller;

import live.dolang.api.common.response.BaseResponse;
import live.dolang.api.feed.dto.FeedParticipantsResponseDto;
import live.dolang.api.feed.dto.TodayFeedResponseDto;
import live.dolang.api.feed.service.FeedService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/feed")
@RequiredArgsConstructor
public class FeedController {

    private final FeedService feedService;

    // TODO: 오늘의 피드
    @GetMapping("/today")
    public ResponseEntity<TodayFeedResponseDto> getTodayPost(@AuthenticationPrincipal Jwt jwt,
                                                             @RequestParam(value = "lang")String lang,
                                                             @RequestParam(value = "langLevel")String langLevel) {
        int userId = Integer.parseInt(jwt.getId());
        return feedService.getTodayFeed(userId, lang, langLevel);
    }

    @GetMapping("/today/participants")
    public ResponseEntity<FeedParticipantsResponseDto> getTodayFeedParticipants(
            @RequestParam(value = "feedId") Integer feedId,         // 필수 값
            @RequestParam(value = "sort") String sort,              // 필수 값
            @RequestParam(value = "length") Integer length,         // 필수 값
            @RequestParam(value = "nextCursor", required = false) Integer nextCursor // 선택적(Optional)
    ) {
        return feedService.getTodayFeedParticipants(feedId, sort, length, nextCursor);
    }



}