package live.dolang.core.domain.user.repository;

import live.dolang.core.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);

    User findByGoogleId(String googleId);
}
