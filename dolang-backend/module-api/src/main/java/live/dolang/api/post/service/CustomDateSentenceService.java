package live.dolang.api.post.service;

import live.dolang.core.domain.date_sentence.repository.DateSentenceRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class CustomDateSentenceService {
    private final DateSentenceRepository dateSentenceRepository;

    public boolean isDateSentenceExists(Integer dateSentenceId) {
        return dateSentenceRepository.existsById(dateSentenceId);
    }
}
