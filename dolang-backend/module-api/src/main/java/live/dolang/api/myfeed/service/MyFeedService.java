package live.dolang.api.myfeed.service;

import live.dolang.api.myfeed.dto.LikedFeedParticipantsResponseDto;

public interface MyFeedService {
    LikedFeedParticipantsResponseDto getMyLikedParticipantsList(Integer userId, Integer feedId, Integer length, String nextCursor);
}
