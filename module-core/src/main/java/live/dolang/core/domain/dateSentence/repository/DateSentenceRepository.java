package live.dolang.core.domain.dateSentence.repository;

import live.dolang.core.domain.dateSentence.DateSentence;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DateSentenceRepository extends JpaRepository<DateSentence, Integer> {
}
