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
        return UserProfile.builder()
                .user(User.builder().id(userid).build())
                .userId(userid)
                .nickname(this.nickname)
                .countryId(this.nationality)
                .nativeLanguageId(this.nativeLanguage)
                .interestLanguageId(this.targetLanguage)
                .build();
    }
    public List<UserLanguageLevel> toUserLanguageLevelEntity(int userId) {
        //유저 모국어 언어 수준 등록(모국어는 언어 레벨 최고등급으로 등록)
        List<UserLanguageLevel> languageLevelList = new ArrayList<>();
        languageLevelList.add(UserLanguageLevel.builder()
                .languageId(this.nativeLanguage)
                .languageLevelId("SS")
                .user(User.builder().id(userId).build())
                .build()
        );
        //유저 관심 언어 수준 등록
        languageLevelList.add(UserLanguageLevel.builder()
                .languageId(this.targetLanguage)
                .languageLevelId(this.proficiencyLevel)
                .user(User.builder().id(userId).build())
                .build()
        );
        return languageLevelList;
    }

}
