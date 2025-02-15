package live.dolang.core.domain.user_sentence_like.repository;

import live.dolang.core.domain.user_sentence_like.UserSentenceLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

public interface UserSentenceLikeRepository
        extends JpaRepository<UserSentenceLike, Integer>,
        QuerydslPredicateExecutor<UserSentenceLikeRepository> {
}