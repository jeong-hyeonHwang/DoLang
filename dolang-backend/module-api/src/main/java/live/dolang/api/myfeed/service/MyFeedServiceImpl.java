package live.dolang.api.myfeed.service;

import live.dolang.api.common.exception.NotFoundException;
import live.dolang.api.common.response.BaseResponseStatus;
import live.dolang.api.feed.repository.FeedRepository;
import live.dolang.api.myfeed.dto.LikedFeedParticipantsResponseDto;
import live.dolang.api.post.service.*;
import live.dolang.core.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class MyFeedServiceImpl implements MyFeedService {
    private final UserService userService;
    private final CustomDateSentenceService customDateSentenceService;
    private final PostBookmarkService postBookmarkService;
    private final PostHeartService postHeartService;

    private final FeedRepository feedRepository;
    
    @Override
    public LikedFeedParticipantsResponseDto getMyLikedParticipantsList(Integer userId, Integer feedId, Integer length, String nextCursor) {
        if (userId == null || !userService.isUserExists(userId)) {
            throw new NotFoundException(BaseResponseStatus.NOT_EXIST_USER);
        }

        if (!customDateSentenceService.isDateSentenceExists(feedId)) {
            throw new NotFoundException(BaseResponseStatus.NOT_EXIST_FEED);
        }

        boolean isNativeFeed = feedRepository.isNativeFeed(userId, feedId);
        LikedFeedParticipantsResponseDto list;
        if (isNativeFeed) {
            list = feedRepository.selectMyHeartedParticipantsList(userId, feedId, length, nextCursor);
        } else {
            list = feedRepository.selectMyBookmarkedParticipantsList(userId, feedId, length, nextCursor);

        }
        if (isNativeFeed) { // 모국어 피드 - 하트
            for(LikedFeedParticipantsResponseDto.FeedParticipant p : list.getParticipants()) {
                p.setHeartCount(postHeartService.getPostHeartCount(feedId, p.getPostId()));
            }
        } else { // 외국어 피드 - 북마크
            for(LikedFeedParticipantsResponseDto.FeedParticipant p : list.getParticipants()) {
                p.setBookmarkCount(postBookmarkService.getPostBookmarkCount(feedId, p.getPostId()));
            }
        }
        return list;
    }
}
