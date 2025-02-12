package live.dolang.api.feed.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.ExpressionUtils;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import live.dolang.api.common.enums.SortType;
import live.dolang.api.feed.dto.FeedParticipantsResponseDto;
import live.dolang.api.feed.projection.TodayFeedProjection;
import live.dolang.core.domain.date_sentence.QDateSentence;
import live.dolang.core.domain.user.QUser;
import live.dolang.core.domain.user_date_sentence.QUserDateSentence;
import live.dolang.core.domain.user_date_sentence.UserDateSentence;
import live.dolang.core.domain.user_profile.QUserProfile;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

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

    /**
     * 1) LATEST 정렬:
     *    - QueryDSL로 user_date_sentence 테이블에서 feedId에 맞는 데이터 조회
     *    - nextCursor(=uds.id)보다 작은 레코드만
     *    - createdAt DESC 정렬
     */
    @Override
    public FeedParticipantsResponseDto selectTodayFeedParticipantsByLatest(
            Integer feedId,
            Integer length,
            String nextCursor,
            boolean isNativeFeed)
    {
        QUserDateSentence uds = QUserDateSentence.userDateSentence;
        QUser user = QUser.user;
        QUserProfile up = QUserProfile.userProfile;

        // 커서로부터 마지막 createdAt과 id를 파싱 (커서가 null이 아닐 경우)
        Instant lastCreatedAt = null;
        Integer lastId = null;
        if (nextCursor != null && nextCursor.describeConstable().isPresent()) {
            try {
                // 예를 들어, "2025-02-11T22:54:12.821Z,123" 형식이라 가정
                String[] parts = nextCursor.split(",");
                lastCreatedAt = Instant.parse(parts[0]);
                lastId = Integer.valueOf(parts[1]);
            } catch (Exception e) {
                // 파싱 실패 시 예외 처리 (혹은 로그 기록)
                throw new IllegalArgumentException("Invalid nextCursor format. Expected format: 'createdAt,id'");
            }
        }

        // WHERE 조건: date_sentence.id가 feedId와 일치하는 것만 선택
        BooleanBuilder builder = new BooleanBuilder();
        builder.and(uds.dateSentence.id.eq(feedId));

        // 페이징 조건:
        // - createdAt이 lastCreatedAt보다 이전이거나,
        // - createdAt이 동일하면 id가 lastId보다 작은 것만 선택
        if (lastCreatedAt != null) {
            builder.and(
                    uds.createdAt.lt(lastCreatedAt)
                            .or(uds.createdAt.eq(lastCreatedAt)
                                    .and(uds.id.lt(lastId)))
            );
        }

        // 쿼리 생성: createdAt 내림차순, 그리고 동일한 createdAt일 경우 id 내림차순
        List<UserDateSentence> udsList = queryFactory
                .selectFrom(uds)
                .join(uds.user, user).fetchJoin()
                .join(user.userProfile, up).fetchJoin()
                .where(builder)
                .orderBy(uds.createdAt.desc(), uds.id.desc())
                .limit(length + 1)  // 커서 페이징용 limit+1
                .fetch();

        // hasNext 판단
        boolean hasNext = udsList.size() > length;
        if (hasNext) {
            udsList = udsList.subList(0, length);
        }

        // 다음 커서 계산: 마지막 요소의 createdAt과 id 값을 기준으로 함
        String newNextCursor = null;
        if (hasNext && !udsList.isEmpty()) {
            UserDateSentence lastEntity = udsList.get(udsList.size() - 1);
            newNextCursor = lastEntity.getCreatedAt().toString() + "," + lastEntity.getId();
        }

        // DTO 매핑
        List<FeedParticipantsResponseDto.FeedParticipant> participants =
                udsList.stream()
                        .map(this::mapToParticipantDto)
                        .collect(Collectors.toList());

        // meta 정보 생성
        FeedParticipantsResponseDto.Meta meta = FeedParticipantsResponseDto.Meta.builder()
                .sort(SortType.LATEST.toString().toLowerCase())
                .limit(length)
                .nextCursor(newNextCursor)
                .hasNext(hasNext)
                .build();

        return FeedParticipantsResponseDto.builder()
                .participants(participants)
                .meta(meta)
                .build();
    }

    /**
     * user_date_sentence -> FeedParticipantsResponseDto.FeedParticipant 로 매핑
     */
    private FeedParticipantsResponseDto.FeedParticipant mapToParticipantDto(UserDateSentence entity) {
        // 여기서는 LATEST 정렬 시에는 일단 bookmarkCount=0, heartCount=null 처리를 예시로
        Integer postId = entity.getId();
        String profileImageUrl = entity.getUser().getUserProfile().getProfileImageUrl();
        String countryId = entity.getUser().getUserProfile().getCountryId();
        String voiceUrl = entity.getUserDateSentencesUrl();
        Instant createdAt = entity.getCreatedAt();

        return FeedParticipantsResponseDto.FeedParticipant.builder()
                .postId(postId)
                .profileImageUrl(profileImageUrl)
                .country(countryId)
                .voiceUrl(voiceUrl)
                .voiceCreatedAt(createdAt)
                .build();
    }
}