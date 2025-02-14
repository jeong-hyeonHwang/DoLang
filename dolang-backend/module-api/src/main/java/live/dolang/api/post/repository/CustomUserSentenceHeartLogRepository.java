package live.dolang.api.post.repository;

import live.dolang.api.post.dto.HeartCountDto;

import java.util.List;

public interface CustomUserSentenceHeartLogRepository {
    List<HeartCountDto> findAllPostHeartCountsRaw();
    Boolean getLatestHeartYn(Integer userId, Integer feedId, Integer userDateSentenceId);
}
