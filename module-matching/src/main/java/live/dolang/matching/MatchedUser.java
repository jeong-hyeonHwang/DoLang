package live.dolang.matching;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MatchedUser {
    private Integer userId;
    private String peerId;
    private String nativeLanguageId;
}
