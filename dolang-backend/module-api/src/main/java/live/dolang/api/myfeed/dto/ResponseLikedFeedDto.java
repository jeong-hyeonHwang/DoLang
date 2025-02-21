package live.dolang.api.myfeed.dto;

import lombok.*;

import java.time.Instant;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class ResponseLikedFeedDto {
    private Integer feedId;
    private Instant date;
    private String nativeSentence;
    private String targetSentence;
}