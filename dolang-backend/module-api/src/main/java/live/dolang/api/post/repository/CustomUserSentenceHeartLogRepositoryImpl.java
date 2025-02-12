package live.dolang.api.post.repository;

import com.querydsl.core.Tuple;
import com.querydsl.jpa.impl.JPAQueryFactory;
import live.dolang.api.post.dto.HeartCountDto;
import live.dolang.core.domain.user_sentence_like_log.QUserSentenceLikeLog;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class CustomUserSentenceHeartLogRepositoryImpl implements CustomUserSentenceHeartLogRepository {
    private final JPAQueryFactory queryFactory;

    @Override
    public List<HeartCountDto> findAllPostHeartCountsRaw() {
        QUserSentenceLikeLog log = QUserSentenceLikeLog.userSentenceLikeLog;

        List<Tuple> logTuples = queryFactory
                .select(log.dateSentence.id, log.userDateSentence.id, log.count())
                .from(log)
                .where(log.likeYn.isTrue())
                .groupBy(log.dateSentence.id, log.userDateSentence.id)
                .fetch();

        return logTuples.stream()
                .map(tuple -> new HeartCountDto(
                        tuple.get(log.dateSentence.id),              // feedId
                        tuple.get(log.userDateSentence.id),            // postId
                        Objects.requireNonNull(tuple.get(log.count())).intValue() // heartCount
                ))
                .collect(Collectors.toList());
    }

    @Override
    public Boolean getLatestHeartYn(Integer userId, Integer feedId, Integer userDateSentenceId) {
        QUserSentenceLikeLog log = QUserSentenceLikeLog.userSentenceLikeLog;

        Boolean isHearted = queryFactory
                .select(log.likeYn)
                .from(log)
                .where(
                        log.user.id.eq(userId)
                                .and(log.userDateSentence.id.eq(userDateSentenceId))
                                .and(log.dateSentence.id.eq(feedId))
                )
                .orderBy(log.createdAt.desc())
                .limit(1)
                .fetchFirst();
        return Optional.ofNullable(isHearted).orElse(false);
    }
}
