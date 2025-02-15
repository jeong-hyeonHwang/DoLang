package live.dolang.api.user.dto;

import live.dolang.core.domain.user.User;
import live.dolang.core.domain.user_profile.UserProfile;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RequestUpdateUserInfoDto {
    private String nickname;
    private String nationality;
    private String nativeLanguage;
    private String targetLanguage;
    private String proficiencyLevel;
    private List<Integer> interests;
    private MultipartFile profileImageUrl;

    public UserProfile toUserProfileEntity(int userid) {
        return UserProfile.builder()
                .userId(userid)
                .nickname(this.nickname)
                .countryId(this.nationality)
                .nativeLanguageId(this.nativeLanguage)
                .interestLanguageId(this.targetLanguage)
                .build();
    }
}
