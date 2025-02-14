package live.dolang.api.feed.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class TodayFeedResponseDto {
    private Feed feed;

    @Getter
    @Builder
    public static class Feed {
        private String date;
        private Integer feedId;
        private String lang;
        private Boolean isNativeFeed;
        private SentenceInfo sentenceInfo;
        private UserParticipation userParticipation;
    }

    @Getter
    @Builder
    public static class SentenceInfo {
        private String sentence;
        private String level;
    }

    @Getter
    @Builder
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class UserParticipation {
        private Integer postId;
        private String voiceUrl;
        private Integer bookmarkCount;
        private Integer heartCount;
        private Boolean isSelfHearted;
        private Boolean isSelfBookmarked;
        private String voiceCreatedAt;

        public void setBookmarkCount(Integer bookmarkCount) {
            this.bookmarkCount = bookmarkCount;
        }

        public void setHeartCount(Integer heartCount) {
            this.heartCount = heartCount;
        }

        public void setIsSelfBookmarked(Boolean isSelfBookmarked) {
            this.isSelfBookmarked = isSelfBookmarked;
        }
    }
}
