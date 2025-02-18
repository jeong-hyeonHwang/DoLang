package live.dolang.core.domain.user_tag.repository;

import live.dolang.core.domain.user.User;
import live.dolang.core.domain.user_tag.UserTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

import java.util.List;

public interface UserTagRepository extends JpaRepository<UserTag, Integer>, QuerydslPredicateExecutor<UserTag> {
    List<UserTag> findByUser(User user);
}
