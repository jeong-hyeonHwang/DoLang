package live.dolang.matching;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import live.dolang.matching.response.MatchedUser;
import live.dolang.matching.response.MatchedUserTag;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

import static live.dolang.core.domain.language_level.tag_translation.QTagTranslation.tagTranslation;
import static live.dolang.core.domain.tag.QTag.tag;
import static live.dolang.core.domain.user.QUser.user;
import static live.dolang.core.domain.user_profile.QUserProfile.userProfile;
import static live.dolang.core.domain.user_tag.QUserTag.userTag;

@Repository
@RequiredArgsConstructor
public class MatchingRepository {

    private final JPAQueryFactory queryFactory;

    /**
     * 특정 사용자에 대한 태그 ID 목록을 반환합니다.
     *
     * @param userId 사용자 ID
     * @return 특정 사용자의 태그 ID 목록
     */
    public List<Integer> findUserTagIdListOrderByTagId(Integer userId) {
        return queryFactory.select(userTag.tag.id)
                .from(userTag)
                .where(userTag.user.id.eq(userId))
                .orderBy(userTag.tag.id.asc())
                .fetch();
    }

    /**
     * 특정 사용자에 대한 태그 목록을 반환합니다.
     *
     * @param userId 사용자 ID
     * @return 특정 사용자의 태그 목록
     */
    public List<MatchedUserTag> getMatchedDetailUserTagList(Integer userId) {
        return queryFactory.select(Projections.bean(MatchedUserTag.class,
                        tag.id.as("tagId"),
                        tagTranslation.translatedName.as("translatedName")
                ))
                .from(userTag)
                .join(userTag.tag, tag)
                .join(userTag.user, user)
                .join(user.userProfile, userProfile)
                .join(tagTranslation).on(
                        tagTranslation.tag.eq(tag),
                        tagTranslation.nativeLanguageId.eq(userProfile.nativeLanguageId)
                )
                .where(userTag.user.id.eq(userId))
                .orderBy(tag.id.asc())
                .fetch();
    }

    /**
     * 특정 사용자에 대한 프로필 정보를 조회합니다.
     *
     * @param userId 사용자 ID
     * @return 특정 사용자의 프로필 정보
     */
    public MatchedUser getMatchedDetailUser(Integer userId) {
        return queryFactory.select(Projections.bean(MatchedUser.class,
                        userProfile.gender.as("gender"),
                        userProfile.profileImageUrl.as("profileImageUrl"),
                        userProfile.nickname.as("nickname"),
                        userProfile.countryId.as("countryId"),
                        userProfile.nativeLanguageId.as("nativeLanguageId"),
                        userProfile.interestLanguageId.as("interestLanguageId")
                ))
                .from(userProfile)
                .join(userProfile.user, user)
                .where(user.id.eq(userId))
                .fetchOne();
    }

}
