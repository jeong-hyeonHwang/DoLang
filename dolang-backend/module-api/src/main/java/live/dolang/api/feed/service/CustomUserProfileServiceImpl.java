package live.dolang.api.feed.service;

import live.dolang.core.domain.date_sentence.DateSentence;
import live.dolang.core.domain.date_sentence.repository.DateSentenceRepository;
import live.dolang.core.domain.user_profile.UserProfile;
import live.dolang.core.domain.user_profile.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomUserProfileServiceImpl implements CustomUserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final DateSentenceRepository dateSentenceRepository;

    /**
     * 사용자의 피드(날짜 문장)가 모국어 피드인지 여부를 판단하는 메서드.
     *
     * 예시 로직:
     * - 사용자의 프로필에서 nativeLanguageId를 가져오고,
     * - feedId에 해당하는 DateSentence의 level 값을 언어 코드(예: "EN", "KO" 등)로 가정하여 비교.
     * - 두 값이 일치하면 모국어 피드로 판단합니다.
     *
     * @param userId 사용자 ID
     * @param feedId 피드(날짜 문장) ID
     * @return 모국어 피드이면 true, 아니면 false
     */
    public boolean isNativeFeed(Integer userId, Integer feedId) {
        // 사용자 프로필 조회
        Optional<UserProfile> profileOpt = userProfileRepository.findById(userId);
        if (profileOpt.isEmpty()) {
            // 프로필이 없으면 기본적으로 모국어 피드가 아니라고 판단
            return false;
        }
        UserProfile profile = profileOpt.get();

        // feedId를 DateSentence의 id로 가정하여 조회
        Optional<DateSentence> sentenceOpt = dateSentenceRepository.findById(feedId);
        if (sentenceOpt.isEmpty()) {
            return false;
        }
        DateSentence sentence = sentenceOpt.get();

        // 예시로 사용자 프로필의 nativeLanguageId와 날짜 문장의 level을 비교합니다.
        // 실제로는 DateSentence에 언어 정보를 별도로 두거나, 다른 방식으로 비교할 수 있습니다.
        return profile.getNativeLanguageId().equalsIgnoreCase(sentence.getLevel());
    }

    public boolean isUserNativeLanguage(Integer userId, String languageId) {
        return userProfileRepository.existsByUserIdAndNativeLanguageId(userId, languageId);
    }
}