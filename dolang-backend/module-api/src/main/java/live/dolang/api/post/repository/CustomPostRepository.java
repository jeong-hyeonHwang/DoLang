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
                .join(voiceDateSentence)
                .on(userDateSentence.dateSentence.id.eq(voiceDateSentence.id))
                // 사용자 프로필을 가져오기 위해 조인
                .join(userProfile)
                .on(userDateSentence.user.id.eq(userProfile.user.id))
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
        QUserDateSentence userDateSentence = QUserDateSentence.userDateSentence;
        QUserSentenceBookmark userSentenceBookmark = QUserSentenceBookmark.userSentenceBookmark;
        QDateSentence voiceDateSentence = QDateSentence.dateSentence; // 음성 URL 등 기본 정보용
        QDateSentence nativeDateSentence = new QDateSentence("nativeDateSentence"); // 모국어 문장
        QDateSentence targetDateSentence = new QDateSentence("targetDateSentence"); // 선택 언어 문장
        QUserProfile userProfile = QUserProfile.userProfile;

        StringExpression resolvedTargetLanguageExpr =
                targetLanguage != null
                        ? Expressions.stringTemplate("{0}", targetLanguage)
                        : userProfile.interestLanguageId;

        List<ResponseLikedFeedDto> content = queryFactory
                .select(Projections.bean(
                        ResponseLikedFeedDto.class,
                        voiceDateSentence.id.as("feedId"),
                        voiceDateSentence.dateId.as("date"),
                        nativeDateSentence.sentence.as("nativeSentence"),
                        targetDateSentence.sentence.as("targetSentence")
                ))
                .distinct()
                .from(userSentenceBookmark)
                .join(userSentenceBookmark.userDateSentence, userDateSentence)
                .join(userDateSentence.dateSentence, voiceDateSentence)
                // 사용자 프로필을 가져오기 위해 조인
                .join(userProfile)
                .on(userDateSentence.user.id.eq(userProfile.user.id))
                // 모국어 문장을 위해 date_sentences를 left join
                .join(nativeDateSentence)
                .on(nativeDateSentence .language.id.eq(userProfile.nativeLanguageId)
                        .and(nativeDateSentence.level.eq("B1"))
                        .and(nativeDateSentence.dateId.eq(voiceDateSentence.dateId)))
                // 선택 언어 문장을 위해 date_sentences를 left join
                .join(targetDateSentence)
                .on(targetDateSentence.language.id.eq(resolvedTargetLanguageExpr)
                        .and(targetDateSentence.level.eq("B1"))
                        .and(targetDateSentence.dateId.eq(voiceDateSentence.dateId)))
                .where(userSentenceBookmark.user.id.eq(userId))
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        JPAQuery<Long> countQuery = queryFactory
                .select(userDateSentence.count())
                .from(userDateSentence)
                .where(userDateSentence.user.id.eq(userId));

        return PageableExecutionUtils.getPage(content, pageable, countQuery::fetchOne);
    }

    public Page<ResponseLikedFeedDto> getMyHeartedFeedList(int userId, String targetLanguage, Pageable pageable) {
        QUserDateSentence userDateSentence = QUserDateSentence.userDateSentence;
        QUserSentenceLike userSentenceLike = QUserSentenceLike.userSentenceLike; // 사용자의 특정 피드 좋아요를
        QDateSentence voiceDateSentence = QDateSentence.dateSentence; // 음성 URL 등 기본 정보용
        QDateSentence nativeDateSentence = new QDateSentence("nativeDateSentence"); // 모국어 문장
        QDateSentence targetDateSentence = new QDateSentence("targetDateSentence"); // 선택 언어 문장
        QUserProfile userProfile = QUserProfile.userProfile;

        StringExpression resolvedTargetLanguageExpr =
                targetLanguage != null
                        ? Expressions.stringTemplate("{0}", targetLanguage)
                        : userProfile.interestLanguageId;

        List<ResponseLikedFeedDto> content = queryFactory
                .select(Projections.bean(
                        ResponseLikedFeedDto.class,
                        voiceDateSentence.id.as("feedId"),
                        voiceDateSentence.dateId.as("date"),
                        nativeDateSentence.sentence.as("nativeSentence"),
                        targetDateSentence.sentence.as("targetSentence")
                ))
                .distinct()
                .from(userSentenceLike)
                .join(userSentenceLike.userDateSentence, userDateSentence)
                .join(userDateSentence.dateSentence, voiceDateSentence)
                // 사용자 프로필을 가져오기 위해 조인
                .join(userProfile)
                .on(userDateSentence.user.id.eq(userProfile.user.id))
                // 모국어 문장을 위해 date_sentences를 left join
                .join(nativeDateSentence)
                .on(nativeDateSentence .language.id.eq(userProfile.nativeLanguageId)
                        .and(nativeDateSentence.level.eq("B1")) // 현재 사용 언어 레벨은 B1밖에 없으므로 명시적으로 설정
                        .and(nativeDateSentence.dateId.eq(voiceDateSentence.dateId)))
                // 선택 언어 문장을 위해 date_sentences를 left join
                .join(targetDateSentence)
                .on(targetDateSentence.language.id.eq(resolvedTargetLanguageExpr)
                        .and(targetDateSentence.level.eq("B1")) // 현재 사용 언어 레벨은 B1밖에 없으므로 명시적으로 설정
                        .and(targetDateSentence.dateId.eq(voiceDateSentence.dateId)))
                .where(userSentenceLike.user.id.eq(userId))
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        JPAQuery<Long> countQuery = queryFactory
                .select(userDateSentence.count())
                .from(userDateSentence)
                .where(userDateSentence.user.id.eq(userId));

        return PageableExecutionUtils.getPage(content, pageable, countQuery::fetchOne);
    }
}
