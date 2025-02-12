package live.dolang.api.post.dto;

import lombok.*;

import java.time.Instant;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class ResponseFeedDto {
    private Instant date;
    private String voiceUrl;
    private String sentence;
}
