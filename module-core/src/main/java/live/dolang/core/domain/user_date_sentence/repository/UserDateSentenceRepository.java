package live.dolang.core.domain.user_date_sentence.repository;

import live.dolang.core.domain.user_date_sentence.UserDateSentence;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserDateSentenceRepository extends JpaRepository<UserDateSentence, Integer> {
    Optional<UserDateSentence> findById(Integer userDateSentenceId);
}
