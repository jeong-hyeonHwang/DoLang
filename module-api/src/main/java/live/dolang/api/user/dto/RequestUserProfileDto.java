package live.dolang.api.user.dto;

import live.dolang.core.domain.user.User;
import live.dolang.core.domain.user_profile.UserProfile;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RequestUserProfileDto {
    private String nickname;
    private String nationality;
    private String nativeLanguage;
    private String targetLanguage;
    private String proficiencyLevel;
    private List<Integer> interests;

    public UserProfile toUserProfileEntity(int userid) {
        return UserProfile.builder()
                .user(User.builder().id(userid).build())
                .userId(userid)
                .nickname(this.nickname)
                .countryId(this.nationality)
                .nativeLanguageId(this.nativeLanguage)
                .interestLanguageId(this.targetLanguage)
                .build();
    }

}
