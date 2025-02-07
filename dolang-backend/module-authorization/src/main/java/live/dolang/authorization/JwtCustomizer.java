package live.dolang.authorization;

import live.dolang.core.domain.user.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.server.authorization.token.JwtEncodingContext;
import org.springframework.security.oauth2.server.authorization.token.OAuth2TokenCustomizer;
import org.springframework.stereotype.Component;

@Component
public class JwtCustomizer implements OAuth2TokenCustomizer<JwtEncodingContext> {

    private final UserRepository userRepository;

    public JwtCustomizer(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void customize(JwtEncodingContext context) {
        Authentication authentication = context.getPrincipal();
        Object principal = authentication.getPrincipal();

        String sub;
        if (principal instanceof OidcUser oidcUser) {
            sub = oidcUser.getSubject();
        } else if (principal instanceof OAuth2User oauth2User) {
            sub = oauth2User.getAttribute("sub");
        } else {
            throw new IllegalStateException("Unexpected principal type: " + principal.getClass());
        }

        userRepository.findByGoogleId(sub)
                .ifPresent(user -> context.getClaims().id(user.getId().toString()));
    }
}