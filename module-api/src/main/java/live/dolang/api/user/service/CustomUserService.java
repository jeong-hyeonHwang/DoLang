package live.dolang.api.user.service;

import live.dolang.api.common.exception.UserNotFoundException;
import live.dolang.api.common.exception.UserProfileNotFoundException;
import live.dolang.api.common.response.BaseResponseStatus;
import live.dolang.api.user.dto.RequestUserProfileDto;
import live.dolang.api.user.dto.ResponseUserInfoDto;
import live.dolang.api.user.repository.CustomUserRepository;
import live.dolang.core.domain.tag.Tag;
import live.dolang.core.domain.user.User;
import live.dolang.core.domain.user.repository.UserRepository;
import live.dolang.core.domain.user_profile.UserProfile;
import live.dolang.core.domain.user_profile.repository.UserProfileRepository;
import live.dolang.core.domain.user_tag.UserTag;
import live.dolang.core.domain.user_tag.repository.UserTagRepository;
import live.dolang.core.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
public class CustomUserService {
    private final UserService userService;
    private final CustomUserRepository customUserRepository;
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final UserTagRepository userTagRepository;

    public ResponseUserInfoDto getUserInfo(int userId) {
        if(!userService.isUserExists(userId)) {
            throw new UserNotFoundException(BaseResponseStatus.NOT_EXIST_USER);
        }
        ResponseUserInfoDto dto = customUserRepository.getUserInfo(userId)
                .orElseThrow(() -> new UserProfileNotFoundException(BaseResponseStatus.NOT_EXIST_USER_PROFILE));
        List<String> tags = customUserRepository.getUserTagList(userId);
        dto.setTags(tags);
        return dto;
    }

    @Transactional
    public void registerUserInfo(int userId, RequestUserProfileDto requestUserProfileDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(BaseResponseStatus.NOT_EXIST_USER));
        //유저 프로파일 저장
        UserProfile userProfile = requestUserProfileDto.toUserProfileEntity(userId);
        System.out.println(userProfile.toString());
        userProfileRepository.save(userProfile);

        //유저 관심사 태그저장
        List<Integer> tags = requestUserProfileDto.getInterests();
        List<UserTag> userTags = tags.stream()
                .map(tagId -> new UserTag(null, user, new Tag(tagId, null)))
                .toList();
        userTagRepository.saveAll(userTags);
    }


}
