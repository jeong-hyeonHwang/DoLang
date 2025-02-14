package live.dolang.core.domain.tag.repository;

import live.dolang.core.domain.tag.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TagRepository extends JpaRepository<Tag, Integer> {
}
