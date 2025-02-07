package live.dolang.core.domain.language.repository;

import live.dolang.core.domain.language.Language;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LanguageRepository extends JpaRepository<Language, String> {

}
