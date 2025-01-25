package live.dolang.authorization;

import live.dolang.core.domain.user.User;
import live.dolang.core.domain.user.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.function.Consumer;

@AllArgsConstructor
public class UserRepositoryOAuth2UserHandler implements Consumer<OAuth2User> {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public void accept(OAuth2User user) {
        if (this.userRepository.findByGoogleId(user.getName()) == null) {
            this.userRepository.save(
                    User.builder()
                            .email(user.getAttribute("email"))
                            .googleId(user.getName())
                            .createAt(LocalDateTime.now())
                            .build()
            );
        }
    }

}