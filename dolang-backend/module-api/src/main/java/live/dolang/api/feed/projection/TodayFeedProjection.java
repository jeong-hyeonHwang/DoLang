package live.dolang.api.feed.projection;

import live.dolang.api.feed.dto.TodayFeedResponseDto;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TodayFeedProjection {
    private TodayFeedResponseDto.Feed feed;

    private Instant date;
    private Integer feedId;
    private String language;
    private Boolean isNativeFeed;
    private String sentence;
    private String level;
    private Integer postId;
    private String voiceUrl;
    private Instant voiceCreatedAt;
}
