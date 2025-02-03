package live.dolang.core.domain.user_sentence_like_log.repository;

import live.dolang.core.domain.user_sentence_like_log.UserSentenceLikeLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserSentenceLikeLogRepository extends JpaRepository<UserSentenceLikeLog, Integer> {
}
