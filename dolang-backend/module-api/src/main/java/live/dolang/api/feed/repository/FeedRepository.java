package live.dolang.api.feed.repository;

import live.dolang.api.feed.dto.FeedParticipantsResponseDto;
import live.dolang.api.feed.projection.TodayFeedProjection;

import java.time.Instant;

public interface FeedRepository {
    TodayFeedProjection selectTodayFeed(Integer userId, String lang, String langLevel, Instant todayUTCInstant);

    FeedParticipantsResponseDto selectTodayFeedParticipantsByLatest(Integer feedId, Integer length, String nextCursor, boolean isNativeFeed);
}
