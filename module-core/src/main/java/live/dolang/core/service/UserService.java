package live.dolang.core.service;

import live.dolang.core.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public boolean isUserExists(Integer userId) {
        return userRepository.existsById(userId);
    }
}

