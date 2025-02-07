package live.dolang.api.feed.service;

import live.dolang.api.feed.dto.FeedParticipantsResponseDto;
import live.dolang.api.feed.dto.TodayFeedResponseDto;
import org.springframework.http.ResponseEntity;

public interface FeedService {
    ResponseEntity<TodayFeedResponseDto> getTodayFeed(int userId, String lang, String langLevel);

    ResponseEntity<FeedParticipantsResponseDto> getTodayFeedParticipants(Integer feedId, String sort, Integer length, Integer nextCursor);
}
