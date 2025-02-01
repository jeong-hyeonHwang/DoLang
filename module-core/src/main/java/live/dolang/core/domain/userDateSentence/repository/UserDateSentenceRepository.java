package live.dolang.core.domain.userDateSentence.repository;

import live.dolang.core.domain.userDateSentence.UserDateSentence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

public interface UserDateSentenceRepository extends JpaRepository<UserDateSentence, Integer> { }
