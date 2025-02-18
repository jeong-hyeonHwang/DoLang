package live.dolang.api.common.config.batch;

import live.dolang.api.common.util.UTCTimeUtil;
import live.dolang.core.domain.date.Date;
import live.dolang.core.domain.date.repository.DateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@RequiredArgsConstructor
@Component
public class UpdateDateTasklet implements Tasklet {
    private final DateRepository dateRepository;

    @Override
    @Transactional
    public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) {
        try {
            Instant id = UTCTimeUtil.getStartOfDayUTC(Instant.now());

            // 데이터 저장
            dateRepository.save(Date.builder().id(id).build());
            return RepeatStatus.FINISHED; // 정상적으로 완료
        } catch (Exception e) {
            // 예외를 발생시켜 Step이 실패하도록 처리
            throw new RuntimeException("UpdateDateTasklet 실패", e);
        }
    }
}
