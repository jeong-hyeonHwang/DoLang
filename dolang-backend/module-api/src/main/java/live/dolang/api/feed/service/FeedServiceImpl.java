package live.dolang.api.feed.service;

import live.dolang.api.common.enums.SortType;
import live.dolang.api.common.exception.NotFoundException;
import live.dolang.api.common.response.BaseResponseStatus;
import live.dolang.api.common.util.UTCTimeUtil;
import live.dolang.api.feed.dto.FeedParticipantsResponseDto;
import live.dolang.api.feed.dto.TodayFeedResponseDto;
import live.dolang.api.feed.projection.TodayFeedProjection;
import live.dolang.api.feed.repository.FeedRepository;
import live.dolang.api.post.service.PostBookmarkService;
import live.dolang.api.post.service.UserBookmarkService;
import live.dolang.core.domain.date.repository.DateRepository;
import live.dolang.core.domain.language.repository.LanguageRepository;
import live.dolang.core.domain.language_level.repository.LanguageLevelRepository;
import live.dolang.core.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@AllArgsConstructor
public class FeedServiceImpl implements FeedService{

    private final UserService userService;
    private final UserBookmarkService userBookmarkService;
    private final PostBookmarkService postBookmarkService;

    private final FeedRepository feedRepository;
    private final LanguageRepository languageRepository;
    private final DateRepository dateRepository;
    private final LanguageLevelRepository languageLevelRepository;

    @Override
    public ResponseEntity<TodayFeedResponseDto> getTodayFeed(Integer userId, String language, String languageLevel) {

        // 존재하지 않는 사용자
        if(userId != null && !userService.isUserExists(userId)) {
            throw new NotFoundException(BaseResponseStatus.NOT_EXIST_USER);
        }

        // 존재하지 않는 언어
        if(!languageRepository.existsById(language)) {
            throw new NotFoundException(BaseResponseStatus.NOT_EXIST_LANGUAGE);
        }

        // 존재하지 않는 날짜
        Instant todayUTCInstant = UTCTimeUtil.getTodayUTCInstant();
        if(!dateRepository.existsById(todayUTCInstant)) {
            throw new NotFoundException(BaseResponseStatus.NOT_EXIST_DATE);
        }

        // 존재하지 않는 레벨
        if(!languageLevelRepository.existsById(languageLevel)) {
            throw new NotFoundException(BaseResponseStatus.NOT_EXIST_LANGUAGE_LEVEL);
        }

        TodayFeedProjection proj = feedRepository.selectTodayFeed(userId, language, languageLevel, todayUTCInstant);
        Boolean isUserBookmarked = null;
        Boolean isNativeFeed = proj.getIsNativeFeed();

        if (userId != null && proj.getFeedId() != null && proj.getPostId() != null) {
            isUserBookmarked = userBookmarkService.isBookmarked(userId, proj.getFeedId(), proj.getPostId());
        }

        TodayFeedResponseDto.Feed.FeedBuilder feedBuilder = TodayFeedResponseDto.Feed.builder()
                .date(UTCTimeUtil.formatInstant(proj.getDate()))
                .feedId(proj.getFeedId())
                .lang(proj.getLang())
                .isNativeFeed(isNativeFeed)
                .sentenceInfo(TodayFeedResponseDto.SentenceInfo.builder()
                        .sentence(proj.getSentence())
                        .level(proj.getLevel())
                        .build());

        // userId가 null이 아닐 때만 userParticipation 세팅
        if (userId != null) {
            feedBuilder.userParticipation(
                    TodayFeedResponseDto.UserParticipation.builder()
                            .postId(proj.getPostId())
                            .voiceUrl(proj.getVoiceUrl())
                            .voiceCreatedAt(UTCTimeUtil.formatInstant(proj.getVoiceCreatedAt()))
                            .build()
            );
        }

        // 최종적으로 Feed 객체를 만들고, TodayFeedResponseDto에 세팅
        TodayFeedResponseDto dto = TodayFeedResponseDto.builder()
                .feed(feedBuilder.build())
                .build();

        if (userId == null) {
            return ResponseEntity.ok(dto);
        }

        // TODO: 0 대신 모국어 피드가 아닌 경우 postLikeService로부터 갱신하기
        if (isNativeFeed) {
            dto.getFeed().getUserParticipation().setHeartCount(0);
        } else {
            dto.getFeed().getUserParticipation().setBookmarkCount(postBookmarkService.getPostBookmarkCount(proj.getFeedId(), proj.getPostId()));
        }
        dto.getFeed().getUserParticipation().setIsSelfBookmarked(isUserBookmarked);
        return ResponseEntity.ok(dto);
    }

    @Override
    public ResponseEntity<FeedParticipantsResponseDto> getTodayFeedParticipants(Integer feedId, String sort, Integer length, Integer nextCursor) {
        SortType sortType = SortType.fromString(sort);

        return ResponseEntity.ok(feedRepository.selectTodayFeedParticipants(feedId, sortType, length, nextCursor));
    }
}
