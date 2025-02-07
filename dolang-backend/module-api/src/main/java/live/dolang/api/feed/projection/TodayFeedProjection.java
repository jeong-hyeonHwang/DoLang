package live.dolang.api.feed.projection;

import live.dolang.api.feed.dto.TodayFeedResponseDto;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TodayFeedProjection {
    private TodayFeedResponseDto.Feed feed;

    private String date;
    private Long feedId;
    private String lang;
    private boolean isNativeFeed;
    private Long sentenceId;
    private String sentence;
    private String level;
    private String voiceUrl;
    private int count;
    private String voiceCreatedAt;
}
