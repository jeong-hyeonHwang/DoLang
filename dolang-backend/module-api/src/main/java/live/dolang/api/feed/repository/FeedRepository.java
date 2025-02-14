package live.dolang.api.feed.repository;

import live.dolang.api.feed.dto.TodayFeedParticipantsResponseDto;
import live.dolang.api.myfeed.dto.LikedFeedParticipantsResponseDto;
import live.dolang.api.feed.projection.TodayFeedProjection;

import java.time.Instant;

public interface FeedRepository {
    TodayFeedProjection selectTodayFeed(Integer userId, String lang, String langLevel, Instant todayUTCInstant);

    TodayFeedParticipantsResponseDto selectFeedParticipantsByLatest(Integer feedId, Integer length, String nextCursor);

    LikedFeedParticipantsResponseDto selectMyLikedParticipantsList(Integer feedId, Integer length, String nextCursor);
}
