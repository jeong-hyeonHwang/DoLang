package live.dolang.api.user.service;

import live.dolang.api.common.exception.UserNotFoundException;
import live.dolang.api.common.exception.UserProfileNotFoundException;
import live.dolang.api.common.response.BaseResponseStatus;
import live.dolang.api.user.dto.ResponseUserInfoDto;
import live.dolang.api.user.repository.CustomUserRepository;
import live.dolang.core.domain.user.repository.UserRepository;
import live.dolang.core.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class CustomUserService {
    private final CustomUserRepository customUserRepository;
    private final UserService userService;

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
}
