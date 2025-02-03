package live.dolang.api.user.repository;


import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import live.dolang.api.user.dto.ResponseUserInfoDto;
import live.dolang.core.domain.user.QUser;
import live.dolang.core.domain.user_language_level.QUserLanguageLevel;
import live.dolang.core.domain.user_profile.QUserProfile;
import live.dolang.core.domain.user_tag.QUserTag;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class CustomUserRepository {
    private final JPAQueryFactory queryFactory;

    public ResponseUserInfoDto getUserInfo(int userId) {
        QUser user = QUser.user;
        QUserProfile profile = QUserProfile.userProfile;
        QUserLanguageLevel userLanguageLevel = QUserLanguageLevel.userLanguageLevel;
        QUserTag userTag = QUserTag.userTag;
        ResponseUserInfoDto dto = queryFactory
                .select(Projections.bean(
                        ResponseUserInfoDto.class,
                        profile.profileImageUrl.as("profileImage"),
                        profile.nickname.as("nickname"),
                        profile.countryId.as("countryId"),
                        profile.nativeLanguageId.as("nativeLanguageId")
                ))
                .from(user)
                .join(user.userProfile, profile)
                .where(user.id.eq(userId))
                .fetchOne();

        return null;
    }
}
