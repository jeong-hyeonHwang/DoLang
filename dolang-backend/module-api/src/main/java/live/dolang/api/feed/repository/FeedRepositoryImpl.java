package live.dolang.api.feed.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import live.dolang.api.common.enums.SortType;
import live.dolang.api.feed.dto.FeedParticipantsResponseDto;
import live.dolang.api.feed.projection.TodayFeedProjection;
import live.dolang.core.domain.date_sentence.QDateSentence;
import live.dolang.core.domain.user_date_sentence.QUserDateSentence;
import live.dolang.core.domain.user_profile.QUserProfile;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.Instant;

@Repository
@RequiredArgsConstructor
public class FeedRepositoryImpl implements FeedRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public TodayFeedProjection selectTodayFeed(int userId, String lang, String langLevel, Instant todayUTCInstant) {
        // 1. date_sentences 테이블에서 todayUTCInstant와 langLevel에 해당하는 문장 조회
        QDateSentence qDateSentence = QDateSentence.dateSentence;
        QUserDateSentence qUserDateSentence = QUserDateSentence.userDateSentence;
        QUserProfile qUserProfile = QUserProfile.userProfile;

        TodayFeedProjection result = queryFactory
                .select(Projections.constructor(
                        TodayFeedProjection.class,
                        qDateSentence.dateId,
                        qDateSentence.id,
                        qDateSentence.sentence,
                        qDateSentence.level,
                        qUserDateSentence.userDateSentencesUrl,
                        qUserDateSentence.createdAt,
                        new CaseBuilder()
                                .when(qUserProfile.nativeLanguageId.eq(lang))
                                .then(true)
                                .otherwise(false)
                                .as("isNativeFeed")
                ))
                .from(qDateSentence)
                // date_sentences와 user_date_sentences 조인 (해당 문장에 대한 사용자 데이터)
                .leftJoin(qUserDateSentence)
                .on(qUserDateSentence.dateSentence.id.eq(qDateSentence.id)
                        .and(qUserDateSentence.user.id.eq(userId)))
                // user_profiles 조인 (해당 사용자의 native_language 조회)
                .leftJoin(qUserProfile)
                .on(qUserProfile.userId.eq(userId))
                // 오늘 날짜와 해당 레벨 조건
                .where(
                        qDateSentence.dateId.eq(todayUTCInstant)
                                .and(qDateSentence.level.eq(langLevel))
                )
                .fetchOne();


        if (result == null) {
            // 조건에 맞는 문장이 없으면 null 반환 또는 예외 처리
            return null;
        }

        return result;
    }

    @Override
    public FeedParticipantsResponseDto selectTodayFeedParticipants(Integer feedId, SortType sort, Integer length, Integer nextCursor) {
        // TODO: 오늘의 피드에 참여한 참여자 정보를 정렬 기준에 따라 조회하는 로직 구현
        return null;
    }
}
