package live.dolang.api.post.repository;

import com.querydsl.core.Tuple;
import com.querydsl.jpa.impl.JPAQueryFactory;
import live.dolang.api.post.dto.BookmarkCountDTO;
import live.dolang.core.domain.user_sentence_bookmark_log.QUserSentenceBookmarkLog;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class CustomUserSentenceBookmarkLogRepositoryImpl implements CustomUserSentenceBookmarkLogRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<BookmarkCountDTO> findAllPostBookmarkCountsRaw() {
        QUserSentenceBookmarkLog log = QUserSentenceBookmarkLog.userSentenceBookmarkLog;

        List<Tuple> logTuples = queryFactory
                .select(log.userDateSentence.id, log.count())
                .from(log)
                .where(log.bookmarkYn.isTrue())
                .groupBy(log.userDateSentence.id)
                .fetch();

        return logTuples.stream()
                .map(tuple -> new BookmarkCountDTO(
                        tuple.get(log.userDateSentence.id),
                        Objects.requireNonNull(tuple.get(log.count())).intValue()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public Boolean getLatestBookmarkYn(Integer userId, Integer userDateSentenceId) {
        QUserSentenceBookmarkLog log = QUserSentenceBookmarkLog.userSentenceBookmarkLog;

        Boolean isBookmark = queryFactory
                .select(log.bookmarkYn)
                .from(log)
                .where(
                        log.user.id.eq(userId)
                                .and(log.userDateSentence.id.eq(userDateSentenceId))
                )
                .orderBy(log.createAt.desc())
                .limit(1)
                .fetchFirst(); // ✅ `fetchOne()` 대신 `fetchFirst()` 사용하여 안전성 향상

        return Optional.ofNullable(isBookmark).orElse(false);
    }
}
