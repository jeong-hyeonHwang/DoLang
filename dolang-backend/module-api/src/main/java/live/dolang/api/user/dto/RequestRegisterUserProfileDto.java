package live.dolang.api.user.dto;

import live.dolang.core.domain.user.User;
import live.dolang.core.domain.user_language_level.UserLanguageLevel;
import live.dolang.core.domain.user_profile.UserProfile;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RequestRegisterUserProfileDto {
    private String nickname;
    private String nationality;
    private String nativeLanguage;
    private String targetLanguage;
    private String proficiencyLevel;
    private List<Integer> interests;

    public UserProfile toUserProfileEntity(int userid) {
        String defaultImageUrl = "https://dolang.s3.ap-northeast-2.amazonaws.com/profile-image/20a46a33-5788-4862-9821-6856d4b8da6e_default_image.png";
        return UserProfile.builder()
                .user(User.builder().id(userid).build())
                .userId(userid)
                .profileImageUrl(defaultImageUrl) //기본 이미지URL
                .nickname(this.nickname)
                .countryId(this.nationality)
                .nativeLanguageId(this.nativeLanguage)
                .interestLanguageId(this.targetLanguage)
                .build();
    }
}
