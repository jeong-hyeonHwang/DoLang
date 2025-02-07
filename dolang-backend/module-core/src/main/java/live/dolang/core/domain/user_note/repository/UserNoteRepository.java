package live.dolang.core.domain.user_note.repository;

import live.dolang.core.domain.user.User;
import live.dolang.core.domain.user_note.UserNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

import java.util.List;

public interface UserNoteRepository extends JpaRepository<UserNote, Integer>, QuerydslPredicateExecutor<UserNote> {

    // 사용할 가능성이 적지만 ES가 날라갈 경우 사용
    List<UserNote> findByUser(User user);
}
