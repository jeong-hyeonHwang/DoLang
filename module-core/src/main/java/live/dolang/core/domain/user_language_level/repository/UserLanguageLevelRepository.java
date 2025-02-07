package live.dolang.core.domain.user_language_level.repository;

import live.dolang.core.domain.user_language_level.UserLanguageLevel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Set;

public interface UserLanguageLevelRepository extends JpaRepository<UserLanguageLevel, Integer> {
    Set<UserLanguageLevel> findByUserId(int userId);
}
