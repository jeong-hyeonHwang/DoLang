package live.dolang.api.user.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import live.dolang.api.user.dto.ResponseUserInfoDto;
import live.dolang.api.user.dto.TagDto;
import live.dolang.core.domain.tag.QTag;
import live.dolang.core.domain.tag.Tag;
import live.dolang.core.domain.user.QUser;
import live.dolang.core.domain.user_language_level.QUserLanguageLevel;
import live.dolang.core.domain.user_profile.QUserProfile;
import live.dolang.core.domain.user_tag.QUserTag;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Repository
public class CustomUserRepository {
    private final JPAQueryFactory queryFactory;

    public Optional<ResponseUserInfoDto> getUserInfo(int userId) {
        QUser user = QUser.user;
        QUserProfile profile = QUserProfile.userProfile;
        QUserLanguageLevel userLanguageLevel = QUserLanguageLevel.userLanguageLevel;
        QUserTag userTag = QUserTag.userTag;
        QTag tag = QTag.tag;
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

    //관심사 태그 조회
    public List<TagDto> getUserTagList(int userId) {
        QTag tag = QTag.tag;
        QUserTag userTag = QUserTag.userTag;

        List<TagDto> tags = queryFactory
                .select(Projections.bean(TagDto.class,
                        tag.id.as("tagId"),
                        tag.name.as("tagName")
                ))
                .from(userTag)
                .join(userTag.tag,tag)
                .where(userTag.user.id.eq(userId))
                .fetch();
        return tags;
    }
}
