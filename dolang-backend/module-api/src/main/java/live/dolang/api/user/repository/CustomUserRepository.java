package live.dolang.api.user.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import live.dolang.api.user.dto.ResponseUserInfoDto;
import live.dolang.api.user.dto.TagDto;
import live.dolang.core.domain.language_level.tag_translation.QTagTranslation;
import live.dolang.core.domain.tag.QTag;
import live.dolang.core.domain.user.QUser;
import live.dolang.core.domain.user_language_level.QUserLanguageLevel;
import live.dolang.core.domain.user_profile.QUserProfile;
import live.dolang.core.domain.user_tag.QUserTag;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import static live.dolang.core.domain.user_profile.QUserProfile.userProfile;

@RequiredArgsConstructor
@Repository
public class CustomUserRepository {
    private final JPAQueryFactory queryFactory;

    public Optional<ResponseUserInfoDto> getUserInfo(int userId) {
        QUser user = QUser.user;
        QUserProfile profile = userProfile;
        QUserLanguageLevel userLanguageLevel = QUserLanguageLevel.userLanguageLevel;
        //사용자 기본정보 + 프로필 조회
        ResponseUserInfoDto dto = queryFactory
                .select(Projections.bean(
                        ResponseUserInfoDto.class,
                        profile.profileImageUrl.as("profileImageUrl"),
                        profile.nickname.as("nickname"),
                        profile.countryId.as("nationality"),
                        profile.nativeLanguageId.as("nativeLanguage"),
                        profile.interestLanguageId.as("targetLanguage"),
                        userLanguageLevel.languageLevelId.as("proficiencyLevel")
                ))
                .from(profile)
                .join(user).on(profile.userId.eq(user.id))
                .leftJoin(userLanguageLevel)
                .on(userLanguageLevel.user.id.eq(user.id)
                        .and(userLanguageLevel.languageId.eq(profile.interestLanguageId)))
                .where(user.id.eq(userId))
                .fetchOne();
        return Optional.ofNullable(dto);
    }

    // 관심사 태그 조회
    public List<TagDto> getUserTagList(int userId) {
        QTag tag = QTag.tag;
        QUser user = QUser.user;
        QUserTag userTag = QUserTag.userTag;
        QTagTranslation tagTranslation = QTagTranslation.tagTranslation;
        QUserProfile userProfile = QUserProfile.userProfile;

        return queryFactory
                .select(Projections.bean(TagDto.class,
                        tag.id.as("tagId"),
                        tagTranslation.translatedName.as("tagName")
                ))
                .from(userTag)
                .join(userTag.user, user).on(user.id.eq(userId))
                .join(user.userProfile, userProfile)
                .join(userTag.tag, tag)
                .join(tagTranslation).on(tagTranslation.tag.eq(tag))
                .where(
                        tagTranslation.nativeLanguageId.eq(userProfile.nativeLanguageId)
                )
                .fetch();
    }
}
