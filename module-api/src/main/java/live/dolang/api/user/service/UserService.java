package live.dolang.api.user.service;

import live.dolang.api.user.dto.ResponseUserInfoDto;
import live.dolang.core.domain.user.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserService {
    private final UserRepository userRepository;

//    public ResponseUserInfoDto getUserInfo() {
//
//
//    }


}
