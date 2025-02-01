package live.dolang.core.domain.userSentenceBookmarkLog.repository;

import live.dolang.core.domain.userSentenceBookmarkLog.UserSentenceBookmarkLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

import java.util.List;
import java.util.Optional;

public interface UserSentenceBookmarkLogRepository
        extends JpaRepository<UserSentenceBookmarkLog, Integer>,
        QuerydslPredicateExecutor<UserSentenceBookmarkLog>,
        UserSentenceBookmarkLogRepositoryCustom { // ✅ Custom Repository 추가
    Optional<UserSentenceBookmarkLog> findByUser_IdAndUserDateSentence_UserDateSentenceId(Integer userId, Integer postId);
    List<UserSentenceBookmarkLog> findByUser_Id(Integer userId);
}
