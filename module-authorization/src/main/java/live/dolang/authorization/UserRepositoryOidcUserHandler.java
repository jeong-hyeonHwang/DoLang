package live.dolang.authorization;

import live.dolang.core.domain.user.User;
import live.dolang.core.domain.user.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.transaction.annotation.Transactional;

import java.util.function.Consumer;

@AllArgsConstructor
public class UserRepositoryOidcUserHandler implements Consumer<OidcUser> {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public void accept(OidcUser user) {
        if (this.userRepository.findByGoogleId(user.getName()).isEmpty()) {
            this.userRepository.save(
                    User.builder()
                            .email(user.getEmail())
                            .googleId(user.getName())
                            .build()
            );
        }
    }

}