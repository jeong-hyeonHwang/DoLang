package live.dolang.core.domain.user_sentence_bookmark.repository;

import live.dolang.core.domain.user_sentence_bookmark.UserSentenceBookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

import java.util.Optional;

public interface UserSentenceBookmarkRepository
        extends JpaRepository<UserSentenceBookmark, Integer>,
        QuerydslPredicateExecutor<UserSentenceBookmarkRepository> {
    Optional<UserSentenceBookmark> findByUserIdAndUserDateSentenceId(Integer userId, Integer userDateSentenceId);
}