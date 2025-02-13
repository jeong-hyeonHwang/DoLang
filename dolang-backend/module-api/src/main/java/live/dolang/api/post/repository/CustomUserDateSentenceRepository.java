package live.dolang.api.post.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import live.dolang.api.common.util.UTCTimeUtil;
import live.dolang.core.domain.user_date_sentence.QUserDateSentence;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.Instant;

@RequiredArgsConstructor
@Repository
public class CustomUserDateSentenceRepository {
    private final JPAQueryFactory queryFactory;

    /**
     * 특정 사용자가 특정 날짜에 기록을 남겼는지 여부를 반환한다.
     *
     * @param userId     사용자 식별자
     * @param targetDate 비교할 날짜 (LocalDate)
     * @return 기록이 있으면 true, 없으면 false
     */
    public boolean existsByUserIdAndDate(Integer userId, Instant targetDate) {
        QUserDateSentence uds = QUserDateSentence.userDateSentence;
        Instant startInstant = UTCTimeUtil.getStartOfDayUTC(targetDate);
        Instant endInstant = UTCTimeUtil.getEndOfDayUTC(targetDate);

        // (2) QueryDSL에서 조건 설정
        //     createdAt이 [startInstant, endInstant) 범위에 속하면 하루 내에 속하는 것으로 본다.
        return queryFactory
                .selectOne()
                .from(uds)
                .where(
                        uds.user.id.eq(userId),
                        uds.createdAt.goe(startInstant),
                        uds.createdAt.lt(endInstant)
                )
                .fetchFirst() != null;
    }
}