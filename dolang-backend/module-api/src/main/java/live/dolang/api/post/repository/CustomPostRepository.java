package live.dolang.api.post.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import live.dolang.api.post.dto.ResponseFeedDto;
import live.dolang.core.domain.date_sentence.QDateSentence;
import live.dolang.core.domain.user.QUser;
import live.dolang.core.domain.user_date_sentence.QUserDateSentence;
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
    public Page<ResponseFeedDto> getMyFeedList(int userId, Pageable pageable) {
        QDateSentence dateSentence = QDateSentence.dateSentence;
        QUserDateSentence userDateSentence = QUserDateSentence.userDateSentence;
        QUser user = QUser.user;

        List<ResponseFeedDto> content = queryFactory
                .select(Projections.bean(
                        ResponseFeedDto.class,
                        dateSentence.dateId.as("date"),
                        userDateSentence.userDateSentencesUrl.as("voiceUrl"),
                        dateSentence.sentence.as("sentence")
                ))
                .from(userDateSentence)
                .join(dateSentence).on(userDateSentence.dateSentence.id.eq(dateSentence.id))
                .join(userDateSentence).on(userDateSentence.user.id.eq(user.id))
                .where(user.id.eq(userId))
                .offset(pageable.getOffset()) // 몇 번째부터 가져올지
                .limit(pageable.getPageSize()) // 한 페이지 크기
                .fetch();

        Optional<Long> totalCount = Optional.ofNullable(
                queryFactory
                        .select(userDateSentence.count())
                        .from(userDateSentence)
                        .where(userDateSentence.user.id.eq(userId))
                        .fetchOne()
        );
        long count = totalCount.orElse(0L); //totalCount가 null인 경우, 0반환
        return PageableExecutionUtils.getPage(content, pageable, () -> count);
    }
}
