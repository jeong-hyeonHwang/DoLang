package live.dolang.core;

import com.blazebit.persistence.CriteriaBuilderFactory;
import com.blazebit.persistence.querydsl.BlazeJPAQueryFactory;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import live.dolang.core.domain.user.QUser;
import live.dolang.core.domain.user.User;
import live.dolang.core.domain.user.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Slf4j
class DoLangCoreApplicationTests {

    @Test
    void contextLoads() {
    }

    @Test
    void springDataJpaWithQuerydsl(@Autowired UserRepository userRepository) {
        long count = userRepository.count(QUser.user.isNotNull().and(QUser.user.email.eq("dolang")));
        log.info("springDataJpaWithQuerydsl: {}", count);
    }

    @Test
    @Deprecated
    void querydsl(@Autowired JPAQueryFactory queryFactory) {
        long count = queryFactory.select(QUser.user.id)
                .from(QUser.user)
                .fetchCount();
        log.info("querydsl: {}", count);
    }

    @Test
    void querydslWithBlaze(@Autowired CriteriaBuilderFactory cbf, @Autowired EntityManager em) {
        BlazeJPAQueryFactory blazeJPAQueryFactory = new BlazeJPAQueryFactory(em, cbf);
        long count = blazeJPAQueryFactory.select(QUser.user.id)
                .from(QUser.user)
                .fetchCount();
        log.info("querydslWithBlaze: {}", count);
    }

    @Test
    void blazeJPAQuery(@Autowired CriteriaBuilderFactory cbf, @Autowired EntityManager em) {
        Long count = cbf.create(em, Long.class)
                .from(User.class)
                .getCountQuery()
                .getSingleResult();
        log.info("blazeJPAQuery: {}", count);

    }

}
