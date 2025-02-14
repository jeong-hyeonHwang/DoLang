package live.dolang.matching.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@Schema(description = "매칭 결과")
public class MatchedResponse {

    @Schema(description = "내 정보")
    private MatchedUser me;

    @Schema(description = "매칭된 상대방 정보")
    private MatchedUser matchedUser;

    @Schema(description = "webrtc 시작할 사람")
    private boolean ownerYN;
}
