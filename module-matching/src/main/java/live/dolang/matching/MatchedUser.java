package live.dolang.matching;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "매칭된 사용자 정보")
public class MatchedUser {

    @Schema(description = "사용자 ID", example = "1")
    private Integer userId;

    @Schema(description = "구글 고유 ID", example = "1231231233123")
    private String username;

    @Schema(description = "피어링 ID", example = "0e1a55c8-909b-4c60-b8fc-3c63993c4769")
    private String peerId;

    @Schema(description = "사용자의 모국어 ID", example = "en")
    private String nativeLanguageId;
}
