package live.dolang.matching;

import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

import static live.dolang.core.domain.user_tag.QUserTag.userTag;

@Repository
@RequiredArgsConstructor
public class MatchingUserTagRepository {

    private final JPAQueryFactory queryFactory;

    /**
     * 특정 사용자에 대한 태그 ID 목록을 반환합니다.
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

}
