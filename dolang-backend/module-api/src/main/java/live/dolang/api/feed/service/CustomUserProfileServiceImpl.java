package live.dolang.api.feed.service;

import live.dolang.core.domain.user_profile.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserProfileServiceImpl implements CustomUserProfileService {

    private final UserProfileRepository userProfileRepository;

    @Override
    public boolean isUserNativeLanguage(Integer userId, String languageId) {
        return userProfileRepository.existsByUserIdAndNativeLanguageId(userId, languageId);
    }
}