package live.dolang.api.feed.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.ExpressionUtils;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import live.dolang.api.common.enums.SortType;
import live.dolang.api.feed.dto.NativeFeedDto;
import live.dolang.api.feed.dto.TodayFeedParticipantsResponseDto;
import live.dolang.api.myfeed.dto.LikedFeedParticipantsResponseDto;
import live.dolang.api.feed.projection.TodayFeedProjection;
import live.dolang.core.domain.date_sentence.QDateSentence;
import live.dolang.core.domain.language.Language;
import live.dolang.core.domain.user.QUser;
import live.dolang.core.domain.user_date_sentence.QUserDateSentence;
import live.dolang.core.domain.user_date_sentence.UserDateSentence;
import live.dolang.core.domain.user_profile.QUserProfile;
import live.dolang.core.domain.user_sentence_bookmark.QUserSentenceBookmark;
import live.dolang.core.domain.user_sentence_like.QUserSentenceLike;
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
    public boolean isNativeFeed(Integer userId, Integer feedId) {
        QUserProfile userProfile = QUserProfile.userProfile;
        QDateSentence dateSentence = QDateSentence.dateSentence;

        NativeFeedDto dto = queryFactory
                .select(Projections.constructor(
                        NativeFeedDto.class,
                        userProfile.nativeLanguageId.as("nativeLanguage"),
                        dateSentence.language.id.as("sentenceLanguage")
                ))
                .from(userProfile, dateSentence)
                .where(userProfile.user.id.eq(userId)
                        .and(dateSentence.id.eq(feedId)))
                .fetchOne();


        // 조회 결과가 없으면 false 반환
        if (dto == null) {
            return false;
        }

        // 사용자 프로필의 모국어와 date_sentence의 언어가 동일한지 비교
        return dto.nativeLanguage().equalsIgnoreCase(dto.sentenceLanguage());
    }


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
                                .and(qDateSentence.language.eq(Language.builder().id(lang).build()))
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
            result.setLanguage(lang);
        }
        return result;
    }

    @Override
    public TodayFeedParticipantsResponseDto selectFeedParticipantsByLatest(
            Integer feedId,
            Integer length,
            String nextCursor)
    {
        QUserDateSentence uds = QUserDateSentence.userDateSentence;
        QUser user = QUser.user;
        QUserProfile up = QUserProfile.userProfile;

        // 커서로부터 마지막 createdAt과 id를 파싱 (커서가 null이 아닐 경우)
        Instant lastCreatedAt = null;
        Integer lastId = null;
        if (nextCursor != null && nextCursor.describeConstable().isPresent()) {
            try {
                // 예: "2025-02-11T22:54:12.821Z,123"
                String[] parts = nextCursor.split(",");
                lastCreatedAt = Instant.parse(parts[0]);
                lastId = Integer.valueOf(parts[1]);
            } catch (Exception e) {
                // 파싱 실패 시 예외 처리
                throw new IllegalArgumentException("Invalid nextCursor format. Expected format: 'createdAt,id'");
            }
        }

        // WHERE 조건: date_sentence.id가 feedId와 일치하는 것만
        BooleanBuilder builder = new BooleanBuilder();
        builder.and(uds.dateSentence.id.eq(feedId));

        // 커서 기반 페이징 조건:
        // - createdAt이 lastCreatedAt보다 이전이거나
        // - createdAt이 같다면 id가 lastId보다 작은 것
        if (lastCreatedAt != null) {
            builder.and(
                    uds.createdAt.lt(lastCreatedAt)
                            .or(uds.createdAt.eq(lastCreatedAt)
                                    .and(uds.id.lt(lastId)))
            );
        }

        // 쿼리 빌드
        JPAQuery<UserDateSentence> query = queryFactory
                .selectFrom(uds)
                .join(uds.user, user).fetchJoin()
                .join(user.userProfile, up).fetchJoin()
                .where(builder)
                .orderBy(uds.createdAt.desc(), uds.id.desc());

        // 페이징 로직
        List<UserDateSentence> udsList;
        boolean hasNext = false;
        String newNextCursor = null;

        if (length == null) {
            // length가 null => 페이징 없이 전부
            udsList = query.fetch();
        } else {
            // length가 있으면 커서 페이징 로직 적용
            udsList = query
                    .limit(length + 1)
                    .fetch();

            // hasNext 여부 판단
            if (udsList.size() > length) {
                hasNext = true;
                udsList = udsList.subList(0, length);
            }

            // 다음 커서 계산
            if (hasNext && !udsList.isEmpty()) {
                UserDateSentence lastEntity = udsList.get(udsList.size() - 1);
                newNextCursor = lastEntity.getCreatedAt().toString() + "," + lastEntity.getId();
            }
        }

        // DTO 매핑
        List<TodayFeedParticipantsResponseDto.FeedParticipant> participants =
                udsList.stream()
                        .map(this::mapToParticipantDto)
                        .collect(Collectors.toList());

        // meta 정보 생성
        TodayFeedParticipantsResponseDto.Meta meta = TodayFeedParticipantsResponseDto.Meta.builder()
                .sort(SortType.LATEST.toString().toLowerCase())
                .limit(length)          // length가 null이면 null 그대로
                .nextCursor(newNextCursor)  // 페이징 없는 경우(null이면 그대로)
                .hasNext(hasNext)           // 페이징 없는 경우 false 그대로
                .build();

        return TodayFeedParticipantsResponseDto.builder()
                .participants(participants)
                .meta(meta)
                .build();
    }

    @Override
    public LikedFeedParticipantsResponseDto selectMyBookmarkedParticipantsList(Integer userId, Integer feedId, Integer length, String nextCursor) {
        QUserDateSentence userDateSentence = QUserDateSentence.userDateSentence;
        QUser user = QUser.user;
        QUserProfile userProfile = QUserProfile.userProfile;
        QUserSentenceBookmark userSentenceBookmark = QUserSentenceBookmark.userSentenceBookmark;

        // 커서로부터 마지막 createdAt과 id를 파싱 (커서가 null이 아닐 경우)
        Instant lastCreatedAt = null;
        Integer lastId = null;
        if (nextCursor != null && nextCursor.describeConstable().isPresent()) {
            try {
                // 예: "2025-02-11T22:54:12.821Z,123"
                String[] parts = nextCursor.split(",");
                lastCreatedAt = Instant.parse(parts[0]);
                lastId = Integer.valueOf(parts[1]);
            } catch (Exception e) {
                // 파싱 실패 시 예외 처리
                throw new IllegalArgumentException("Invalid nextCursor format. Expected format: 'createdAt,id'");
            }
        }

        // WHERE 조건: date_sentence.id가 feedId와 일치하는 것만
        BooleanBuilder builder = new BooleanBuilder();
        builder.and(userDateSentence.dateSentence.id.eq(feedId));

        // 커서 기반 페이징 조건:
        // - createdAt이 lastCreatedAt보다 이전이거나
        // - createdAt이 같다면 id가 lastId보다 작은 것
        if (lastCreatedAt != null) {
            builder.and(
                    userDateSentence.createdAt.lt(lastCreatedAt)
                            .or(userDateSentence.createdAt.eq(lastCreatedAt)
                                    .and(userDateSentence.id.lt(lastId)))
            );
        }

        // 쿼리 빌드
        JPAQuery<UserDateSentence> query = queryFactory
                .selectFrom(userDateSentence)
                .join(userDateSentence.user, user).fetchJoin()
                .join(user.userProfile, userProfile).fetchJoin()
                .join(userSentenceBookmark)
                .on(userSentenceBookmark.user.id.eq(userId)
                        .and(userSentenceBookmark.userDateSentence.id.eq(userDateSentence.id)))
                .where(builder)
                .orderBy(userDateSentence.createdAt.desc(), userDateSentence.id.desc());

        // 페이징 로직
        List<UserDateSentence> udsList;
        boolean hasNext = false;
        String newNextCursor = null;

        if (length == null) {
            // length가 null => 페이징 없이 전부
            udsList = query.fetch();
        } else {
            // length가 있으면 커서 페이징 로직 적용
            udsList = query
                    .limit(length + 1)
                    .fetch();

            // hasNext 여부 판단
            if (udsList.size() > length) {
                hasNext = true;
                udsList = udsList.subList(0, length);
            }

            // 다음 커서 계산
            if (hasNext && !udsList.isEmpty()) {
                UserDateSentence lastEntity = udsList.get(udsList.size() - 1);
                newNextCursor = lastEntity.getCreatedAt().toString() + "," + lastEntity.getId();
            }
        }

        // DTO 매핑
        List<LikedFeedParticipantsResponseDto.FeedParticipant> participants =
                udsList.stream()
                        .map(this::mapToLikedFeedParticipantDto)
                        .collect(Collectors.toList());

        // meta 정보 생성
        LikedFeedParticipantsResponseDto.Meta meta = LikedFeedParticipantsResponseDto.Meta.builder()
                .limit(length)          // length가 null이면 null 그대로
                .nextCursor(newNextCursor)  // 페이징 없는 경우(null이면 그대로)
                .hasNext(hasNext)           // 페이징 없는 경우 false 그대로
                .build();

        return LikedFeedParticipantsResponseDto.builder()
                .participants(participants)
                .meta(meta)
                .build();
    }

    @Override
    public LikedFeedParticipantsResponseDto selectMyHeartedParticipantsList(Integer userId, Integer feedId, Integer length, String nextCursor) {
        QUserDateSentence userDateSentence = QUserDateSentence.userDateSentence;
        QUser user = QUser.user;
        QUserProfile userProfile = QUserProfile.userProfile;
        QUserSentenceLike userSentenceLike= QUserSentenceLike.userSentenceLike;

        // 커서로부터 마지막 createdAt과 id를 파싱 (커서가 null이 아닐 경우)
        Instant lastCreatedAt = null;
        Integer lastId = null;
        if (nextCursor != null && nextCursor.describeConstable().isPresent()) {
            try {
                // 예: "2025-02-11T22:54:12.821Z,123"
                String[] parts = nextCursor.split(",");
                lastCreatedAt = Instant.parse(parts[0]);
                lastId = Integer.valueOf(parts[1]);
            } catch (Exception e) {
                // 파싱 실패 시 예외 처리
                throw new IllegalArgumentException("Invalid nextCursor format. Expected format: 'createdAt,id'");
            }
        }

        // WHERE 조건: date_sentence.id가 feedId와 일치하는 것만
        BooleanBuilder builder = new BooleanBuilder();
        builder.and(userDateSentence.dateSentence.id.eq(feedId));

        // 커서 기반 페이징 조건:
        // - createdAt이 lastCreatedAt보다 이전이거나
        // - createdAt이 같다면 id가 lastId보다 작은 것
        if (lastCreatedAt != null) {
            builder.and(
                    userDateSentence.createdAt.lt(lastCreatedAt)
                            .or(userDateSentence.createdAt.eq(lastCreatedAt)
                                    .and(userDateSentence.id.lt(lastId)))
            );
        }

        // 쿼리 빌드
        JPAQuery<UserDateSentence> query = queryFactory
                .selectFrom(userDateSentence)
                .join(userDateSentence.user, user).fetchJoin()
                .join(user.userProfile, userProfile).fetchJoin()
                .join(userSentenceLike)
                .on(userSentenceLike.user.id.eq(userId)
                        .and(userSentenceLike.userDateSentence.id.eq(userDateSentence.id)))
                .where(builder)
                .orderBy(userDateSentence.createdAt.desc(), userDateSentence.id.desc());

        // 페이징 로직
        List<UserDateSentence> udsList;
        boolean hasNext = false;
        String newNextCursor = null;

        if (length == null) {
            // length가 null => 페이징 없이 전부
            udsList = query.fetch();
        } else {
            // length가 있으면 커서 페이징 로직 적용
            udsList = query
                    .limit(length + 1)
                    .fetch();

            // hasNext 여부 판단
            if (udsList.size() > length) {
                hasNext = true;
                udsList = udsList.subList(0, length);
            }

            // 다음 커서 계산
            if (hasNext && !udsList.isEmpty()) {
                UserDateSentence lastEntity = udsList.get(udsList.size() - 1);
                newNextCursor = lastEntity.getCreatedAt().toString() + "," + lastEntity.getId();
            }
        }

        // DTO 매핑
        List<LikedFeedParticipantsResponseDto.FeedParticipant> participants =
                udsList.stream()
                        .map(this::mapToLikedFeedParticipantDto)
                        .collect(Collectors.toList());

        // meta 정보 생성
        LikedFeedParticipantsResponseDto.Meta meta = LikedFeedParticipantsResponseDto.Meta.builder()
                .limit(length)          // length가 null이면 null 그대로
                .nextCursor(newNextCursor)  // 페이징 없는 경우(null이면 그대로)
                .hasNext(hasNext)           // 페이징 없는 경우 false 그대로
                .build();

        return LikedFeedParticipantsResponseDto.builder()
                .participants(participants)
                .meta(meta)
                .build();
    }

    /**
     * user_date_sentence -> FeedParticipantsResponseDto.FeedParticipant 로 매핑
     */
    private TodayFeedParticipantsResponseDto.FeedParticipant mapToParticipantDto(UserDateSentence entity) {
        // 여기서는 LATEST 정렬 시에는 일단 bookmarkCount=0, heartCount=null 처리를 예시로
        Integer postId = entity.getId();
        String profileImageUrl = entity.getUser().getUserProfile().getProfileImageUrl();
        String countryId = entity.getUser().getUserProfile().getCountryId();
        String voiceUrl = entity.getUserDateSentencesUrl();
        Instant createdAt = entity.getCreatedAt();

        return TodayFeedParticipantsResponseDto.FeedParticipant.builder()
                .postId(postId)
                .profileImageUrl(profileImageUrl)
                .country(countryId)
                .voiceUrl(voiceUrl)
                .voiceCreatedAt(createdAt)
                .build();
    }

    private LikedFeedParticipantsResponseDto.FeedParticipant mapToLikedFeedParticipantDto(UserDateSentence entity) {
        // 여기서는 LATEST 정렬 시에는 일단 bookmarkCount=0, heartCount=null 처리를 예시로
        Integer postId = entity.getId();
        String profileImageUrl = entity.getUser().getUserProfile().getProfileImageUrl();
        String countryId = entity.getUser().getUserProfile().getCountryId();
        String voiceUrl = entity.getUserDateSentencesUrl();
        Instant createdAt = entity.getCreatedAt();

        return LikedFeedParticipantsResponseDto.FeedParticipant.builder()
                .postId(postId)
                .profileImageUrl(profileImageUrl)
                .country(countryId)
                .voiceUrl(voiceUrl)
                .voiceCreatedAt(createdAt)
                .build();
    }
}