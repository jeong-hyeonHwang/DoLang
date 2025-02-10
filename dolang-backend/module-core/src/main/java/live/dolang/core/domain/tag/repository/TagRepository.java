package live.dolang.core.domain.tag.repository;

import live.dolang.core.domain.tag.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, Integer> {
    Optional<Tag> findByNameAndNativeLanguageId(String name, String nativeLanguageId);
}
