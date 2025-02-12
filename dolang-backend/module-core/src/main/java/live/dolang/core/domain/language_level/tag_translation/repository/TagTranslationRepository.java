package live.dolang.core.domain.language_level.tag_translation.repository;

import live.dolang.core.domain.language_level.tag_translation.TagTranslation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TagTranslationRepository extends JpaRepository<TagTranslation, Integer> {

}
