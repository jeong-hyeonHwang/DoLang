package live.dolang.api.prompt;

import live.dolang.api.prompt.dto.RequestChatQuestionDto;
import live.dolang.api.prompt.service.PromptService;
import live.dolang.core.domain.date_sentence.DateSentence;
import live.dolang.core.domain.date_sentence.repository.DateSentenceRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class PromptTest {
    @Autowired
    private PromptService promptService;
    @Autowired
    private DateSentenceRepository dateSentenceRepository;


    @Test
    @Transactional
    @Rollback
    public void getChatQuestionListTest() {
        //Given
        List<String> interestA = List.of("Sports", "Movie", "Music");
        List<String> interestB = List.of("Food", "Music", "Game");
        RequestChatQuestionDto dto = RequestChatQuestionDto.builder()
                .interestA(interestA)
                .interestB(interestB)
                .build();

        // When
        List<String> questionList = promptService.getChatQuestion(dto);

        // Then
        for(String s : questionList) {
            System.out.println(s);
        }
        assertEquals(5, questionList.size(), "정상적으로 조회가 되었습니다.");
    }

    @Test
    @Transactional
    @Rollback
    public void addDateSentenceTest() {
        // Given
        long originCnt = dateSentenceRepository.count();
        System.out.println("originCnt : "+ originCnt);
        // When
        // Then
        assertDoesNotThrow(() -> promptService.addDateSentence());
        long newCnt = dateSentenceRepository.count();
        System.out.println("newCnt : "+ newCnt);
        assertEquals(2, newCnt - originCnt,"dateSentence가 정상적으로 추가 되었습니다."); //하루에 추가되는 문장이 ko,en 두개라서 2로 테스트함
    }

}
