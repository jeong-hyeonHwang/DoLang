package live.dolang.api.user.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import live.dolang.api.user.dto.ResponseUserInfoDto;
import live.dolang.core.domain.tag.QTag;
import live.dolang.core.domain.tag.Tag;
import live.dolang.core.domain.user.QUser;
import live.dolang.core.domain.user_language_level.QUserLanguageLevel;
import live.dolang.core.domain.user_profile.QUserProfile;
import live.dolang.core.domain.user_tag.QUserTag;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@RequiredArgsConstructor
@Repository
public class CustomUserRepository {
    private final JPAQueryFactory queryFactory;

    public ResponseUserInfoDto getUserInfo(int userId) {
        QUser user = QUser.user;
        QUserProfile profile = QUserProfile.userProfile;
        QUserLanguageLevel userLanguageLevel = QUserLanguageLevel.userLanguageLevel;
        QUserTag userTag = QUserTag.userTag;
        QTag tag = QTag.tag;
        //사용자 기본정보 + 프로필 조회
        ResponseUserInfoDto dto = queryFactory
                .select(Projections.bean(
                        ResponseUserInfoDto.class,
                        profile.profileImageUrl.as("profileImage"),
                        profile.nickname.as("nickname"),
                        profile.countryId.as("countryId"),
                        profile.nativeLanguageId.as("nativeLanguageId"),
                        profile.interestLanguageId.as("interestLanguageId")
                ))
                .from(user)
                .join(user.userProfile, profile)
                .where(user.id.eq(userId))
                .fetchOne();
        //TODO: dto null처리

        //관심언어 레벨 조회(interestLanguageID를 조건으로 조회)
        String interestLanguageLevelId = queryFactory
                .select(userLanguageLevel.languageLevelId)
                .from(userLanguageLevel)
                .where(userLanguageLevel.user.id.eq(userId)
                        .and(userLanguageLevel.languageId.eq(dto.getInterestLanguageId())))
                .fetchOne();

        //관심사 태그 조회
        List<String> tags = queryFactory
                .select(tag.name)
                .from(userTag)
                .join(userTag.tag,tag)
                .where(userTag.user.id.eq(userId))
                .fetch();

        dto.setInterestLanguageId(interestLanguageLevelId);
        dto.setTags(tags);
        return dto;
    }
}
