package live.dolang.core.domain.user_call_detail.repository;

import live.dolang.core.domain.user_call_detail.UserCallDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserCallDetailRepository extends JpaRepository<UserCallDetail, Long> {
}
