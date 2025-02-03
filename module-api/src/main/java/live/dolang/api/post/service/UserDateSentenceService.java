package live.dolang.api.post.service;

import live.dolang.core.domain.user_date_sentence.repository.UserDateSentenceRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserDateSentenceService {
    private final UserDateSentenceRepository userDateSentenceRepository;

    public boolean isUserDateSentenceExists(Integer userDateSentenceId) {
        return userDateSentenceRepository.findByUserDateSentenceId(userDateSentenceId).isEmpty();
    }
}
