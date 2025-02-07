package live.dolang.core.domain.language_level.repository;

import live.dolang.core.domain.language_level.LanguageLevel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LanguageLevelRepository extends JpaRepository<LanguageLevel, String> {
}
