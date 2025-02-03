package live.dolang.core.domain.date_sentence.repository;

import live.dolang.core.domain.date_sentence.DateSentence;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DateSentenceRepository extends JpaRepository<DateSentence, Integer> {
}
