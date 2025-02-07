package live.dolang.matching.response;

import live.dolang.matching.MatchedUser;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MatchedResponse {
    private MatchedUser me;
    private MatchedUser matchedUser;
    private boolean ownerYN;
}
