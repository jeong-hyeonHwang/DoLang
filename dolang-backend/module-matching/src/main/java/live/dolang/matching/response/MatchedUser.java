package live.dolang.matching.response;

import io.swagger.v3.oas.annotations.media.Schema;
import live.dolang.core.domain.user_profile.UserProfile;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "매칭된 사용자 정보")
public class MatchedUser {

    @Schema(description = "피어링 ID", example = "0e1a55c8-909b-4c60-b8fc-3c63993c4769")
    private String peerId;

    @Schema(description = "사용자 ID", example = "1")
    private Integer userId;

    @Schema(description = "구글 고유 ID", example = "1231231233123")
    private String username;

    @Schema(description = "사용자 성별", example = "M|F")
    private UserProfile.Gender gender;

    @Schema(description = "사용자 프로필 url")
    private String profileImageUrl;

    @Schema(description = "사용자 닉네임")
    private String nickname;

    @Schema(description = "사용자 국적", example = "ko")
    private String countryId;

    @Schema(description = "사용자의 모국어 ID", example = "en")
    private String nativeLanguageId;

    @Schema(description = "사용자의 관심언어 ID", example = "kr")
    private String interestLanguageId;

    @Schema(description = "사용자 태그 리스트")
    private List<MatchedUserTag> userTagList;

}
