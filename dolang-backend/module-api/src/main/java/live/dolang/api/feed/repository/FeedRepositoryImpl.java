package live.dolang.api.feed.repository;

import com.querydsl.core.types.ExpressionUtils;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.Expressions;
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
    public TodayFeedProjection selectTodayFeed(Integer userId, String lang, String langLevel, Instant todayUTCInstant) {
        QDateSentence qDateSentence = QDateSentence.dateSentence;
        QUserDateSentence qUserDateSentence = QUserDateSentence.userDateSentence;
        QUserProfile qUserProfile = QUserProfile.userProfile;

        // (1) 공통 쿼리: FROM + WHERE
        var query = queryFactory
                .from(qDateSentence)
                .where(
                        qDateSentence.dateId.eq(todayUTCInstant)
                                .and(qDateSentence.level.eq(langLevel))
                );

        // (2) userId != null이면 JOIN
        if (userId != null) {
            query.leftJoin(qUserDateSentence)
                    .on(qUserDateSentence.dateSentence.id.eq(qDateSentence.id)
                            .and(qUserDateSentence.user.id.eq(userId)));

            query.leftJoin(qUserProfile)
                    .on(qUserProfile.userId.eq(userId));

            // (2-A) SELECT 절
            query.select(Projections.bean(
                    TodayFeedProjection.class,
                    qDateSentence.dateId.as("date"),
                    qDateSentence.id.as("feedId"),
                    qDateSentence.sentence,
                    qDateSentence.level,
                    qUserDateSentence.id.as("postId"),
                    qUserDateSentence.userDateSentencesUrl.as("voiceUrl"),
                    qUserDateSentence.createdAt.as("voiceCreatedAt"),
                    new CaseBuilder()
                            .when(qUserProfile.nativeLanguageId.eq(lang))
                            .then(true)
                            .otherwise(false)
                            .as("isNativeFeed")
            ));
        }
        // (3) userId == null이면 조인 없이 SELECT
        else {
            query.select(Projections.bean(
                    TodayFeedProjection.class,
                    qDateSentence.dateId.as("date"),
                    qDateSentence.id.as("feedId"),
                    qDateSentence.sentence,
                    qDateSentence.level,
                    ExpressionUtils.as(Expressions.constant(Boolean.FALSE), "isNativeFeed")
            ));
            // postId, voiceUrl, voiceCreatedAt, isNativeFeed 등은 빌더에서 전부 null/false가 됨
        }

        // (4) fetch
        TodayFeedProjection result = (TodayFeedProjection) query.fetchOne();
        if (result != null) {
            result.setLang(lang);
        }
        return result;
    }


    @Override
    public FeedParticipantsResponseDto selectTodayFeedParticipants(Integer feedId, SortType sort, Integer length, Integer nextCursor) {
        // TODO: 오늘의 피드에 참여한 참여자 정보를 정렬 기준에 따라 조회하는 로직 구현
        return null;
    }
}