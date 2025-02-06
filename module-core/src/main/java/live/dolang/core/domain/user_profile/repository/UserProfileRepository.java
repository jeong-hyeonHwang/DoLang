package live.dolang.core.domain.user_profile.repository;

import live.dolang.core.domain.user_profile.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserProfileRepository extends JpaRepository<UserProfile,Integer> {

}
