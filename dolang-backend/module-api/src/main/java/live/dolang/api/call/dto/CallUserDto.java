package live.dolang.api.call.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import live.dolang.core.domain.user_profile.UserProfile;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Schema(description = "통화 기록 페이징 내용")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CallUserDto {

    @Schema(description = "사용자 ID", example = "1")
    private Integer userId;

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

}
