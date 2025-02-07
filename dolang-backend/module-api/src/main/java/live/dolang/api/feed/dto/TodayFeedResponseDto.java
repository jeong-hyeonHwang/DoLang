package live.dolang.api.feed.dto;

import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
public class TodayFeedResponseDto {
    private Feed feed;

    @Getter
    @Builder
    public static class Feed {
        private LocalDateTime date;
        private Long feedId;
        private String lang;
        private boolean isNativeFeed;
        private SentenceInfo sentenceInfo;
        private UserParticipation userParticipation;
    }

    @Getter
    @Builder
    public static class SentenceInfo {
        private Long sentenceId;
        private String sentence;
        private String level;
    }

    @Getter
    @Builder
    public static class UserParticipation {
        private String voiceUrl;
        private int count;
        private LocalDateTime voiceCreatedAt;
    }
}
