package live.dolang.api.post.repository;

import com.querydsl.core.Tuple;
import com.querydsl.jpa.impl.JPAQueryFactory;
import live.dolang.api.post.dto.BookmarkCountDTO;
import live.dolang.core.domain.user_sentence_bookmark_log.QUserSentenceBookmarkLog;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class CustomUserSentenceBookmarkLogRepositoryImpl implements CustomUserSentenceBookmarkLogRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<BookmarkCountDTO> findAllPostBookmarkCountsRaw() {
        QUserSentenceBookmarkLog log = QUserSentenceBookmarkLog.userSentenceBookmarkLog;

        List<Tuple> logTuples = queryFactory
                .select(log.userDateSentence.userDateSentenceId, log.count())
                .from(log)
                .where(log.bookmarkYn.isTrue())
                .groupBy(log.userDateSentence.userDateSentenceId)
                .fetch();

        return logTuples.stream()
                .map(tuple -> new BookmarkCountDTO(
                        tuple.get(log.userDateSentence.userDateSentenceId),
                        Objects.requireNonNull(tuple.get(log.count())).intValue()
                ))
                .collect(Collectors.toList());
    }

}
