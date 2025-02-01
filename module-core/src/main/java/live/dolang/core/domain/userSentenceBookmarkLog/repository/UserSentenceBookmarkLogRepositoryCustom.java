package live.dolang.core.domain.userSentenceBookmarkLog.repository;

import com.querydsl.core.Tuple;

import java.util.List;

public interface UserSentenceBookmarkLogRepositoryCustom {
    List<Tuple> findAllPostBookmarkCountsRaw(); // DTO 대신 Object[] 반환
}