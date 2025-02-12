package live.dolang.api.prompt;

import live.dolang.api.prompt.service.PromptService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class PromptTest {
    @Autowired
    PromptService promptService;

    @Test
    @Transactional
    @Rollback
    public void addDateSentenceTest() {
        // When
        promptService.addDateSentence();

        // Then
        // addDateSentence() 메서드가 예외 없이 실행되는지 확인
        assertDoesNotThrow(() -> promptService.addDateSentence());
        promptService.addDateSentence();
    }
}
