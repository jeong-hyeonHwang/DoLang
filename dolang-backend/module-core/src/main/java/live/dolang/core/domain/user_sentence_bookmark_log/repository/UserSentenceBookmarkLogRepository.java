package live.dolang.core.domain.user_sentence_bookmark_log.repository;

import live.dolang.core.domain.user_sentence_bookmark_log.UserSentenceBookmarkLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

public interface UserSentenceBookmarkLogRepository
        extends JpaRepository<UserSentenceBookmarkLog, Integer>,
        QuerydslPredicateExecutor<UserSentenceBookmarkLog> {
}
