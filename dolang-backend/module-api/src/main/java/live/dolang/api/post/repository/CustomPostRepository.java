package live.dolang.api.post.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.StringExpression;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import live.dolang.api.myfeed.dto.ResponseLikedFeedDto;
import live.dolang.api.post.dto.ResponseFeedDto;
import live.dolang.core.domain.date_sentence.QDateSentence;
import live.dolang.core.domain.user_date_sentence.QUserDateSentence;
import live.dolang.core.domain.user_profile.QUserProfile;
import live.dolang.core.domain.user_sentence_bookmark.QUserSentenceBookmark;
import live.dolang.core.domain.user_sentence_like.QUserSentenceLike;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class CustomPostRepository {
    private final JPAQueryFactory queryFactory;

    public Page<ResponseFeedDto> getMyFeedList(int userId, String targetLanguage, Pageable pageable) {
        QUserDateSentence userDateSentence = QUserDateSentence.userDateSentence;
        QDateSentence voiceDateSentence = QDateSentence.dateSentence; // 음성 URL 등 기본 정보용
        QDateSentence nativeDateSentence = new QDateSentence("nativeDateSentence"); // 모국어 문장
        QDateSentence targetDateSentence = new QDateSentence("targetDateSentence"); // 선택 언어 문장
        QUserProfile userProfile = QUserProfile.userProfile;

        StringExpression resolvedTargetLanguageExpr =
                targetLanguage != null
                        ? Expressions.stringTemplate("{0}", targetLanguage)
                        : userProfile.interestLanguageId;

        List<ResponseFeedDto> content = queryFactory
                .select(Projections.bean(
                        ResponseFeedDto.class,
                        voiceDateSentence.id.as("feedId"),
                        userDateSentence.id.as("postId"),
                        voiceDateSentence.dateId.as("date"),
                        userDateSentence.userDateSentencesUrl.as("voiceUrl"),
                        nativeDateSentence.sentence.as("nativeSentence"),
                        targetDateSentence.sentence.as("targetSentence")
                ))
                .from(userDateSentence)
                // 음성 관련 정보를 위해 dateSentence과 조인 (기본 피드 정보)
                .join(userProfile)
                .on(userDateSentence.user.id.eq(userProfile.user.id))
                .join(voiceDateSentence)
                .on(userDateSentence.dateSentence.id.eq(voiceDateSentence.id)
                        .and(voiceDateSentence.language.id.eq(resolvedTargetLanguageExpr)))
                // 사용자 프로필을 가져오기 위해 조인
                // 모국어 문장을 위해 date_sentences를 left join
                .leftJoin(nativeDateSentence)
                .on(nativeDateSentence .language.id.eq(userProfile.nativeLanguageId)
                        .and(nativeDateSentence.level.eq("B1")) // 현재 사용 언어 레벨은 B1밖에 없으므로 명시적으로 설정
                        .and(nativeDateSentence.dateId.eq(voiceDateSentence.dateId)))
                // 선택 언어 문장을 위해 date_sentences를 left join
                .leftJoin(targetDateSentence)
                .on(targetDateSentence.language.id.eq(resolvedTargetLanguageExpr)
                        .and(targetDateSentence.level.eq("B1")) // 현재 사용 언어 레벨은 B1밖에 없으므로 명시적으로 설정
                        .and(targetDateSentence.dateId.eq(voiceDateSentence.dateId)))
                .where(userDateSentence.user.id.eq(userId))
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Optional<Long> totalCount = Optional.ofNullable(
                queryFactory
                        .select(userDateSentence.count())
                        .from(userDateSentence)
                        .where(userDateSentence.user.id.eq(userId))
                        .fetchOne()
        );
        long count = totalCount.orElse(0L); // totalCount가 null인 경우, 0반환
        return PageableExecutionUtils.getPage(content, pageable, () -> count);
    }

    public Page<ResponseLikedFeedDto> getMyBookmarkedFeedList(int userId, String targetLanguage, Pageable pageable) {
        QUserSentenceBookmark userSentenceBookmark = QUserSentenceBookmark.userSentenceBookmark;
        QUserDateSentence userDateSentence = QUserDateSentence.userDateSentence;
        QDateSentence voiceDateSentence = QDateSentence.dateSentence;
        QUserProfile userProfile = QUserProfile.userProfile;
        QDateSentence nativeDateSentence = new QDateSentence("nativeDateSentence"); // 모국어 문장
        QDateSentence targetDateSentence = new QDateSentence("targetDateSentence"); // 선택 언어 문장

        // targetLanguage 파라미터가 제공되면 해당 값을 사용하고, 없으면 userProfile.interestLanguageId 사용
        StringExpression resolvedTargetLanguageExpr =
                targetLanguage != null
                        ? Expressions.stringTemplate("{0}", targetLanguage)
                        : userProfile.interestLanguageId;

        List<ResponseLikedFeedDto> content = queryFactory
                .select(Projections.bean(
                        ResponseLikedFeedDto.class,
                        Expressions.numberTemplate(Integer.class, "ANY_VALUE({0})", voiceDateSentence.id).as("feedId"),
                        voiceDateSentence.dateId.as("date"),
                        Expressions.stringTemplate("ANY_VALUE({0})", nativeDateSentence.sentence).as("nativeSentence"),
                        Expressions.stringTemplate("ANY_VALUE({0})", targetDateSentence.sentence).as("targetSentence")
                ))
                .from(userSentenceBookmark)
                .join(userSentenceBookmark.userDateSentence, userDateSentence)
                .join(userDateSentence.dateSentence, voiceDateSentence)
                // 사용자 프로필 조인: 사용자의 모국어, 관심언어 값을 들고오기 위함
                .join(userProfile)
                .on(userProfile.user.id.eq(userId))
                // 좋아요를 누른 사용자 userId 필터
                .where(userSentenceBookmark.user.id.eq(userId))
                // 모국어 문장 조인
                .join(nativeDateSentence)
                .on(nativeDateSentence.language.id.eq(userProfile.nativeLanguageId)
                        .and(nativeDateSentence.level.eq("B1"))
                        .and(nativeDateSentence.dateId.eq(voiceDateSentence.dateId)))
                // 선택 언어 문장 조인
                .join(targetDateSentence)
                .on(targetDateSentence.language.id.eq(resolvedTargetLanguageExpr)
                        .and(targetDateSentence.level.eq("B1"))
                        .and(targetDateSentence.dateId.eq(voiceDateSentence.dateId)))
                // 그룹화: voiceDateSentence.date_id 기준으로 그룹화
                .groupBy(voiceDateSentence.dateId)
                .orderBy(voiceDateSentence.dateId.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        // Count 쿼리: 그룹화된 결과의 총 건수를 구하기 위해 ds1_0.date_id의 distinct 개수를 센다.
        JPAQuery<Long> countQuery = queryFactory
                .select(voiceDateSentence.dateId.countDistinct())
                .from(userSentenceBookmark)
                .join(userSentenceBookmark.userDateSentence, userDateSentence)
                .join(userDateSentence.dateSentence, voiceDateSentence)
                .join(userProfile)
                .on(userDateSentence.user.id.eq(userProfile.user.id))
                .where(userSentenceBookmark.user.id.eq(userId));

        return PageableExecutionUtils.getPage(content, pageable, countQuery::fetchOne);
    }

    public Page<ResponseLikedFeedDto> getMyHeartedFeedList(int userId, String targetLanguage, Pageable pageable) {
        QUserSentenceLike userSentenceLike = QUserSentenceLike.userSentenceLike;
        QUserDateSentence userDateSentence = QUserDateSentence.userDateSentence;
        QDateSentence voiceDateSentence = QDateSentence.dateSentence;
        QUserProfile userProfile = QUserProfile.userProfile;
        QDateSentence nativeDateSentence = new QDateSentence("nativeDateSentence"); // 모국어 문장
        QDateSentence targetDateSentence = new QDateSentence("targetDateSentence"); // 선택 언어 문장

        // targetLanguage 파라미터가 제공되면 해당 값을 사용하고, 없으면 userProfile.interestLanguageId 사용
        StringExpression resolvedTargetLanguageExpr =
                targetLanguage != null
                        ? Expressions.stringTemplate("{0}", targetLanguage)
                        : userProfile.interestLanguageId;

        List<ResponseLikedFeedDto> content = queryFactory
                .select(Projections.bean(
                        ResponseLikedFeedDto.class,
                        Expressions.numberTemplate(Integer.class, "ANY_VALUE({0})", voiceDateSentence.id).as("feedId"),
                        voiceDateSentence.dateId.as("date"),
                        Expressions.stringTemplate("ANY_VALUE({0})", nativeDateSentence.sentence).as("nativeSentence"),
                        Expressions.stringTemplate("ANY_VALUE({0})", targetDateSentence.sentence).as("targetSentence")
                ))
                .from(userSentenceLike)
                .join(userSentenceLike.userDateSentence, userDateSentence)
                .join(userDateSentence.dateSentence, voiceDateSentence)
                // 사용자 프로필 조인: 사용자의 모국어, 관심언어 값을 들고오기 위함
                .join(userProfile)
                .on(userProfile.user.id.eq(userId))
                // 좋아요를 누른 사용자 userId 필터
                .where(userSentenceLike.user.id.eq(userId))
                // 모국어 문장 조인
                .join(nativeDateSentence)
                .on(nativeDateSentence.language.id.eq(userProfile.nativeLanguageId)
                        .and(nativeDateSentence.level.eq("B1"))
                        .and(nativeDateSentence.dateId.eq(voiceDateSentence.dateId)))
                // 선택 언어 문장 조인
                .join(targetDateSentence)
                .on(targetDateSentence.language.id.eq(resolvedTargetLanguageExpr)
                        .and(targetDateSentence.level.eq("B1"))
                        .and(targetDateSentence.dateId.eq(voiceDateSentence.dateId)))
                // 그룹화: voiceDateSentence.date_id 기준으로 그룹화
                .groupBy(voiceDateSentence.dateId)
                .orderBy(voiceDateSentence.dateId.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        // Count 쿼리: 그룹화된 결과의 총 건수를 구하기 위해 ds1_0.date_id의 distinct 개수를 센다.
        JPAQuery<Long> countQuery = queryFactory
                .select(voiceDateSentence.dateId.countDistinct())
                .from(userSentenceLike)
                .join(userSentenceLike.userDateSentence, userDateSentence)
                .join(userDateSentence.dateSentence, voiceDateSentence)
                .join(userProfile)
                .on(userDateSentence.user.id.eq(userProfile.user.id))
                .where(userSentenceLike.user.id.eq(userId));

        return PageableExecutionUtils.getPage(content, pageable, countQuery::fetchOne);
    }
}
