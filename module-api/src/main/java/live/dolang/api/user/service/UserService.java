package live.dolang.api.user.service;

import live.dolang.api.user.dto.ResponseUserInfoDto;
import live.dolang.api.user.repository.CustomUserRepository;
import live.dolang.core.domain.user.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class UserService {
    private final CustomUserRepository customUserRepository;

    public ResponseUserInfoDto getUserInfo(int userId) {
        ResponseUserInfoDto dto = customUserRepository.getUserInfo(userId)
                .orElseThrow();
        List<String> tags = customUserRepository.getUserTagList(userId);
        dto.setTags(tags);
        return dto;
    }


}
