package live.dolang.api.myfeed.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.util.List;

@Getter
@Builder
public class LikedFeedParticipantsResponseDto {
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
        private Integer bookmarkCount;

        public void setHeartCount(Integer heartCount) {
            this.heartCount = heartCount;
        }

        public void setBookmarkCount(Integer bookmarkCount) {
            this.bookmarkCount = bookmarkCount;
        }

    }

    @Getter
    @Builder
    public static class Meta {
        private Integer limit;
        private String nextCursor;
        private Boolean hasNext;
    }
}