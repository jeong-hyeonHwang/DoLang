package live.dolang.api.post.service.facade;

import live.dolang.api.post.dto.HeartStatusDto;
import live.dolang.api.post.service.PostHeartService;
import live.dolang.api.post.service.UserHeartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class HeartFacadeService {
    private final UserHeartService userHeartService;
    private final PostHeartService postHeartService;

    @Transactional
    public HeartStatusDto heartUserDateSentence(Integer userId, Integer feedId, Integer postId) {
        boolean isHearted = userHeartService.setUserHeart(userId, feedId, postId);
        if (isHearted) {
            postHeartService.incrementPostHeartCount(feedId, postId);
        } else {
            postHeartService.decrementPostHeartCount(feedId, postId);
        }
        return new HeartStatusDto(isHearted);
    }
}
