package live.dolang.api.feed.repository;

import live.dolang.api.common.enums.SortType;
import live.dolang.api.feed.dto.FeedParticipantsResponseDto;
import live.dolang.api.feed.dto.TodayFeedResponseDto;
import live.dolang.api.feed.projection.TodayFeedProjection;

import java.time.Instant;

public interface FeedRepository {
    TodayFeedProjection selectTodayFeed(int userId, String lang, String langLevel, Instant todayUTCInstant);

    FeedParticipantsResponseDto selectTodayFeedParticipants(Integer feedId, SortType sort, Integer length, Integer nextCursor);
}
