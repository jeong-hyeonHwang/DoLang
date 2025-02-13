package live.dolang.core.domain.user_call.repository;

import live.dolang.core.domain.user_call.UserCall;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserCallRepository extends JpaRepository<UserCall, Integer> {
}
