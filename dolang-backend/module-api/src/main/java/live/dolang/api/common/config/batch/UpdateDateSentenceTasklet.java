package live.dolang.api.common.config.batch;

import live.dolang.api.prompt.service.PromptService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@RequiredArgsConstructor
@Component
public class UpdateDateSentenceTasklet implements Tasklet {
    private final PromptService promptService;
    /**
     * DateSentence(하루 한 문장) 추가
     */
    @Override
    @Transactional
    public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) {
        try {
            // 날짜 문장 추가 로직 실행
            promptService.addDateSentence();
            return RepeatStatus.FINISHED;
        } catch (Exception e) {
            // 예외를 발생시켜 Step이 실패하도록 처리
            throw new RuntimeException("UpdateDateSentenceTasklet 실패", e);
        }
    }
}
