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

    // 피드별, 포스트별 북마크 수를 집계
    @Override
    public List<BookmarkCountDTO> findAllPostBookmarkCountsRaw() {
        QUserSentenceBookmarkLog log = QUserSentenceBookmarkLog.userSentenceBookmarkLog;

        List<Tuple> logTuples = queryFactory
                .select(log.dateSentence.id, log.userDateSentence.id, log.count())
                .from(log)
                .where(log.bookmarkYn.isTrue())
                .groupBy(log.dateSentence.id, log.userDateSentence.id)
                .fetch();

        return logTuples.stream()
                .map(tuple -> new BookmarkCountDTO(
                        tuple.get(log.dateSentence.id),              // feedId
                        tuple.get(log.userDateSentence.id),            // postId
                        Objects.requireNonNull(tuple.get(log.count())).intValue() // bookmarkCount
                ))
                .collect(Collectors.toList());
    }

    // 사용자가 특정 피드 내에서 특정 포스트에 대해 가장 최신의 북마크 상태를 조회합니다.
     // feedId 조건을 추가하여 해당 피드에 속한 데이터만 조회하도록 합니다.
    @Override
    public Boolean getLatestBookmarkYn(Integer userId, Integer feedId, Integer userDateSentenceId) {
        QUserSentenceBookmarkLog log = QUserSentenceBookmarkLog.userSentenceBookmarkLog;

        Boolean isBookmark = queryFactory
                .select(log.bookmarkYn)
                .from(log)
                .where(
                        log.user.id.eq(userId)
                                .and(log.userDateSentence.id.eq(userDateSentenceId))
                                .and(log.dateSentence.id.eq(feedId))
                )
                .orderBy(log.createdAt.desc())
                .limit(1)
                .fetchFirst();
        return Optional.ofNullable(isBookmark).orElse(false);
    }
}
