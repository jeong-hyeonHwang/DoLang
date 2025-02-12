package live.dolang.api.post.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
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

        // 해당 사용자(userId)가 생성시간(createdAt)이 [startOfDay, endOfDay) 범위에 속하는 기록이 존재하는지 확인

        return queryFactory
                .selectOne()
                .from(uds)
                .where(
                        uds.user.id.eq(userId)
                                .and(uds.createdAt.eq(targetDate))
                )
                .fetchFirst() != null;
    }
}
