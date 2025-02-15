package live.dolang.core.domain.user_sentence_like.repository;

import live.dolang.core.domain.user_sentence_like.UserSentenceLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

import java.util.Optional;

public interface UserSentenceLikeRepository
        extends JpaRepository<UserSentenceLike, Integer>,
        QuerydslPredicateExecutor<UserSentenceLikeRepository> {
    Optional<UserSentenceLike> findByUserIdAndUserDateSentenceId(Integer userId, Integer userDateSentenceId);

}