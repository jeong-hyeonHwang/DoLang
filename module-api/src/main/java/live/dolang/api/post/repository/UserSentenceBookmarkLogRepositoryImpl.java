package live.dolang.api.post.repository;

import com.querydsl.core.Tuple;
import com.querydsl.jpa.impl.JPAQueryFactory;
import live.dolang.core.domain.userSentenceBookmarkLog.QUserSentenceBookmarkLog;
import live.dolang.core.domain.userSentenceBookmarkLog.repository.UserSentenceBookmarkLogRepositoryCustom;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class UserSentenceBookmarkLogRepositoryImpl implements UserSentenceBookmarkLogRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<Tuple> findAllPostBookmarkCountsRaw() { // DTO 대신 Tuple 반환
        QUserSentenceBookmarkLog log = QUserSentenceBookmarkLog.userSentenceBookmarkLog;

        return queryFactory
                .select(log.userDateSentence.userDateSentenceId, log.count())
                .from(log)
                .where(log.bookmarkYn.isTrue())
                .groupBy(log.userDateSentence.userDateSentenceId)
                .fetch();
    }
}
