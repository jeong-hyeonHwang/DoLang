package live.dolang.core.domain.userSentenceBookmarkLog.repository;

import live.dolang.core.domain.userSentenceBookmarkLog.UserSentenceBookmarkLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserSentenceBookmarkLogRepository extends JpaRepository<UserSentenceBookmarkLog, Integer> {
}
