package live.dolang.api.feed.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

public class FeedParticipantsResponseDto {
    private List<FeedParticipants> participants;

    @Getter
    @Builder
    public static class FeedParticipants {
        private String profileImageUrl;
        private String country;
        private String nativeLanguage;
        private String voiceUrl;
        private LocalDateTime voiceCreatedAt;

        @JsonInclude(JsonInclude.Include.NON_NULL)
        private Integer heartCount;

        @JsonInclude(JsonInclude.Include.NON_NULL)
        private Integer bookmarkCount;
    }
}