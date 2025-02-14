package live.dolang.api.call.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import live.dolang.api.call.dto.CallPageDto;
import live.dolang.api.call.dto.CallUserDto;
import live.dolang.core.domain.user.QUser;
import live.dolang.core.domain.user_call.QUserCall;
import live.dolang.core.domain.user_call_detail.QUserCallDetail;
import live.dolang.core.domain.user_profile.QUserProfile;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Repository;

import java.util.List;

import static live.dolang.core.domain.user_call_detail.QUserCallDetail.userCallDetail;

@Repository
@RequiredArgsConstructor
public class CallRepository {

    private final JPAQueryFactory queryFactory;

    /**
     * 특정 사용자의 통화 기록 목록을 페이징 조회합니다.
     *
     * @param userId   사용자 ID
     * @param pageable {@link Pageable}
     * @return {@code Page<CallPageDto>}
     */
    public Page<CallPageDto> getCallPage(Integer userId, Pageable pageable) {


        QUserCallDetail userCallDetail1 = new QUserCallDetail("userCallDetail1");
        QUserCallDetail userCallDetail2 = new QUserCallDetail("userCallDetail2");

        QUserCall userCall = QUserCall.userCall;

        QUser user1 = new QUser("user1");
        QUser user2 = new QUser("user2");

        QUserProfile userProfile1 = new QUserProfile("userProfile1");
        QUserProfile userProfile2 = new QUserProfile("userProfile2");

        List<CallPageDto> content = queryFactory.select(Projections.bean(CallPageDto.class,
                        userCall.startedAt.as("startedAt"),
                        userCall.endedAt.as("endedAt"),
                        Projections.constructor(CallUserDto.class,
                                user1.id,
                                userProfile1.gender,
                                userProfile1.profileImageUrl,
                                userProfile1.nickname,
                                userProfile1.countryId,
                                userProfile1.nativeLanguageId,
                                userProfile1.interestLanguageId
                        ).as("me"),
                        Projections.constructor(CallUserDto.class,
                                user2.id,
                                userProfile2.gender,
                                userProfile2.profileImageUrl,
                                userProfile2.nickname,
                                userProfile2.countryId,
                                userProfile2.nativeLanguageId,
                                userProfile2.interestLanguageId
                        ).as("matchedUser")
                ))
                .from(userCallDetail1)
                .join(userCallDetail1.userCall, userCall)
                .join(userCallDetail2)
                .on(
                        userCallDetail2.id.ne(userCallDetail1.id),
                        userCallDetail2.userCall.eq(userCall)
                )
                .join(userCallDetail1.user, user1)
                .join(user1.userProfile, userProfile1)
                .join(userCallDetail2.user, user2)
                .join(user2.userProfile, userProfile2)
                .where(userCallDetail1.user.id.eq(userId))
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(userCall.startedAt.desc())
                .fetch();

        JPAQuery<Long> countQuery = queryFactory.select(userCallDetail.count())
                .from(userCallDetail)
                .where(userCallDetail.user.id.eq(userId));

        return PageableExecutionUtils.getPage(content, pageable, countQuery::fetchOne);
    }
}
