package live.dolang.api.feed.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.util.List;

@Getter
@Builder
public class TodayFeedParticipantsResponseDto {
    private List<FeedParticipant> participants;
    private Meta meta;

    @Getter
    @Builder
    public static class FeedParticipant {
        private Integer postId;
        private String profileImageUrl;
        private String country;
        private String voiceUrl;
        private Instant voiceCreatedAt;

        @JsonInclude(JsonInclude.Include.NON_NULL)
        private Integer heartCount;
        @JsonInclude(JsonInclude.Include.NON_NULL)
        private Boolean isUserHearted = null;

        @JsonInclude(JsonInclude.Include.NON_NULL)
        private Integer bookmarkCount;
        @JsonInclude(JsonInclude.Include.NON_NULL)
        private Boolean isUserBookmarked = null;

        public void setHeartCount(Integer heartCount) {
            this.heartCount = heartCount;
        }

        public void setIsUserHearted(Boolean isUserHearted) {
            this.isUserHearted = isUserHearted;
        }

        public void setBookmarkCount(Integer bookmarkCount) {
            this.bookmarkCount = bookmarkCount;
        }

        public void setIsUserBookmarked(Boolean isUserBookmarked) {
            this.isUserBookmarked = isUserBookmarked;
        }
    }

    @Getter
    @Builder
    public static class Meta {
        private String sort;
        private Integer limit;
        private String nextCursor;
        private Boolean hasNext;
    }
}