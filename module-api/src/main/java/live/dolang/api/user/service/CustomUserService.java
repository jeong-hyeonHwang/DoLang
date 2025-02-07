package live.dolang.api.user.service;

import live.dolang.api.common.exception.NotFoundException;
import live.dolang.api.common.response.BaseResponseStatus;
import live.dolang.api.user.dto.RequestRegisterUserProfileDto;
import live.dolang.api.user.dto.RequestUpdateUserInfoDto;
import live.dolang.api.user.dto.ResponseUserInfoDto;
import live.dolang.api.user.repository.CustomUserRepository;
import live.dolang.core.domain.tag.Tag;
import live.dolang.core.domain.user.User;
import live.dolang.core.domain.user.repository.UserRepository;
import live.dolang.core.domain.user_language_level.UserLanguageLevel;
import live.dolang.core.domain.user_language_level.repository.UserLanguageLevelRepository;
import live.dolang.core.domain.user_profile.UserProfile;
import live.dolang.core.domain.user_profile.repository.UserProfileRepository;
import live.dolang.core.domain.user_tag.UserTag;
import live.dolang.core.domain.user_tag.repository.UserTagRepository;
import live.dolang.core.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
@AllArgsConstructor
public class CustomUserService {
    private final UserService userService;
    private final CustomUserRepository customUserRepository;
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final UserTagRepository userTagRepository;
    private final UserLanguageLevelRepository userLanguageLevelRepository;

    public ResponseUserInfoDto getUserInfo(int userId) {
        if(!userService.isUserExists(userId)) {
            throw new NotFoundException(BaseResponseStatus.NOT_EXIST_USER);
        }
        ResponseUserInfoDto dto = customUserRepository.getUserInfo(userId)
                .orElseThrow(() -> new NotFoundException(BaseResponseStatus.NOT_EXIST_USER_PROFILE));
        List<String> tags = customUserRepository.getUserTagList(userId);
        dto.setTags(tags);
        return dto;
    }

    @Transactional
    public void registerUserInfo(int userId, RequestRegisterUserProfileDto requestRegisterUserProfileDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException(BaseResponseStatus.NOT_EXIST_USER));
        //유저 프로파일 저장
        UserProfile userProfile = requestUserProfileDto.toUserProfileEntity(userId);
        System.out.println(userProfile.toString());
        userProfileRepository.save(userProfile);

        //유저 관심사 태그저장
        List<Integer> tags = requestRegisterUserProfileDto.getInterests();
        List<UserTag> userTags = tags.stream()
                .map(tagId -> new UserTag(null, user, new Tag(tagId, null)))
                .toList();
        userTagRepository.saveAll(userTags);

        //유저 관심언어 수준, 모국어 수준 저장
        List<UserLanguageLevel> userLanguageLevelsList = new ArrayList<>();
        userLanguageLevelsList.add(UserLanguageLevel.builder()
                .user(user)
                .languageId(requestRegisterUserProfileDto.getNativeLanguage())
                .languageLevelId("SS")
                .build()
        );
        userLanguageLevelsList.add(UserLanguageLevel.builder()
                .user(user)
                .languageId(requestRegisterUserProfileDto.getTargetLanguage())
                .languageLevelId(requestRegisterUserProfileDto.getProficiencyLevel())
                .build()
        );
        userLanguageLevelRepository.saveAll(userLanguageLevelsList);
    }

    @Transactional
    public void updateUserInfo(int userId, RequestUpdateUserInfoDto requestUpdateUserInfoDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException(BaseResponseStatus.NOT_EXIST_USER));
        UserProfile newProfile = requestUpdateUserInfoDto.toUserProfileEntity(userId);
        user.updateProfile(newProfile);

        //언어수준 수정
        String newInterestLanguageId = requestUpdateUserInfoDto.getTargetLanguage();
        String newInterestLanguageLevelId = requestUpdateUserInfoDto.getProficiencyLevel();
        //사용자의 언어수준들을 조회
        Set<UserLanguageLevel> originLanguageLevelSet = userLanguageLevelRepository.findByUserId(userId);
        //수정하려는 관심언어의 수준이 기존에 저장되어 있던 언어인지 확인
        UserLanguageLevel existingUserLanguageLevel = isExistUserLanguageLevel(originLanguageLevelSet, newInterestLanguageId);
        //수정된 관심언어가 언어수준 테이블에 저장이 안되어있다면 새롭게 저장
        if(existingUserLanguageLevel==null) {
            UserLanguageLevel newUserLanguageLevel = UserLanguageLevel.builder()
                    .user(user)
                    .languageId(newInterestLanguageId)
                    .languageLevelId(newInterestLanguageLevelId)
                    .build();
            userLanguageLevelRepository.save(newUserLanguageLevel);
        }
        //수정된 관심언어가 언어수준 테이블에 저장이 되어있다면 새롭게 수정
        else {
            existingUserLanguageLevel.updateLanguageLevelId(newInterestLanguageLevelId);
        }
    }

    private UserLanguageLevel isExistUserLanguageLevel(Set<UserLanguageLevel> originUserLanguageLevelSet, String languageId) {
        UserLanguageLevel existingUserLanguageLevel =  originUserLanguageLevelSet.stream()
                .filter(userLanguageLevel -> userLanguageLevel.getLanguageId().equals(languageId))
                .findFirst()
                .orElse(null);
        return existingUserLanguageLevel;
    }

}
