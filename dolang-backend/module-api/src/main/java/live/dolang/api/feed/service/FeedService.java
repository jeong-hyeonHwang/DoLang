package live.dolang.api.feed.service;

import live.dolang.api.common.enums.SortType;
import live.dolang.api.feed.dto.FeedParticipantsResponseDto;
import live.dolang.api.feed.dto.TodayFeedResponseDto;

public interface FeedService {
    TodayFeedResponseDto getTodayFeed(Integer userId, String lang, String langLevel);

    FeedParticipantsResponseDto getTodayFeedParticipants(Integer userId, Integer feedId, SortType sort, Integer length, String nextCursor);
}
