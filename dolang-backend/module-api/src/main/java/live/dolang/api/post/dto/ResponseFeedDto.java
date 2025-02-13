package live.dolang.api.post.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.time.Instant;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ResponseFeedDto {
    private Integer feedId;

    private Integer postId;
    private Instant date;
    private String voiceUrl;
    private String nativeSentence;
    private String targetSentence;

    private Integer bookmarkCount;
    private Integer heartCount;
    private Boolean isSelfHearted;
    private Boolean isSelfBookmarked;

    @JsonIgnore
    private boolean isNativeFeed;
}