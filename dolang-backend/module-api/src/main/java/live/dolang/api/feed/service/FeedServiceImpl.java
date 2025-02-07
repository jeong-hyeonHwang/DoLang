package live.dolang.api.feed.service;

import live.dolang.api.common.enums.SortType;
import live.dolang.api.common.exception.NotFoundException;
import live.dolang.api.common.response.BaseResponseStatus;
import live.dolang.api.feed.dto.FeedParticipantsResponseDto;
import live.dolang.api.feed.dto.TodayFeedResponseDto;
import live.dolang.api.feed.repository.FeedRepository;
import live.dolang.core.domain.date.repository.DateRepository;
import live.dolang.core.domain.language.repository.LanguageRepository;
import live.dolang.core.domain.language_level.repository.LanguageLevelRepository;
import live.dolang.core.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class FeedServiceImpl implements FeedService{

    private final UserService userService;

    private final FeedRepository feedRepository;
    private final LanguageRepository languageRepository;
    private final DateRepository dateRepository;
    private final LanguageLevelRepository languageLevelRepository;

    @Override
    public ResponseEntity<TodayFeedResponseDto> getTodayFeed(int userId, String language, String languageLevel) {

        // 존재하지 않는 사용자
        if(!userService.isUserExists(userId)) {
            throw new NotFoundException(BaseResponseStatus.NOT_EXIST_USER);
        }

        // 존재하지 않는 언어
        if(!languageRepository.existsById(language)) {
            throw new NotFoundException(BaseResponseStatus.NOT_EXIST_LANGUAGE);
        }

        // 존재하지 않는 날짜
//        Instant todayUTCInstant = UTCTimeUtil.getTodayUTCInstant();
//        if(!dateRepository.existsById(todayUTCInstant)) {
//            throw new NotFoundException(BaseResponseStatus.NOT_EXIST_DATE);
//        }

        // 존재하지 않는 레벨
        if(!languageLevelRepository.existsById(languageLevel)) {
            throw new NotFoundException(BaseResponseStatus.NOT_EXIST_DATE);
        }

        return ResponseEntity.ok(null);
    }

    @Override
    public ResponseEntity<FeedParticipantsResponseDto> getTodayFeedParticipants(Integer feedId, String sort, Integer length, Integer nextCursor) {
        SortType sortType = SortType.fromString(sort);

        return ResponseEntity.ok(feedRepository.selectTodayFeedParticipants(feedId, sortType, length, nextCursor));
    }
}
