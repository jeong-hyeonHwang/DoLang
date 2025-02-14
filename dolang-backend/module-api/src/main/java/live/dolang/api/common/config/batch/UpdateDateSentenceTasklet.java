package live.dolang.api.common.config.batch;

import live.dolang.api.prompt.service.PromptService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Slf4j
@RequiredArgsConstructor
@Component
public class UpdateDateSentenceTasklet implements Tasklet {
    private final PromptService promptService;
    /**
     * DateSentence(하루 한 문장) 추가
     */
    @Override
    public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) {
        log.info("start update DateSenteces : {}", LocalDateTime.now());
        promptService.addDateSentence();
        return RepeatStatus.FINISHED;
    }
}
