package live.dolang.core.domain.user.repository;

import live.dolang.core.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

public interface UserRepository extends JpaRepository<User, Long>, QuerydslPredicateExecutor<User> {
    User findByEmail(String email);

    User findByGoogleId(String googleId);
}
