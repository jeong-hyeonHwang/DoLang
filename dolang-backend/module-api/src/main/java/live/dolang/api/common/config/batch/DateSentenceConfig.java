package live.dolang.api.common.config.batch;

import lombok.RequiredArgsConstructor;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
@RequiredArgsConstructor
public class DateSentenceConfig {
    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager;
    private final UpdateDateSentenceTasklet updateDateSentenceTasklet;

    /**
     * Job 설정
     */
    @Bean
    public Job updateDateSentence() {
        return new JobBuilder("updateDateSentence", jobRepository)
                .start(updateDateSentenceStep())
                .build();
    }

    /**
     *  Step 단계 설정
     */
    @Bean
    public Step updateDateSentenceStep() {
        return new StepBuilder("updateDateSentenceStep",jobRepository)
                .tasklet(updateDateSentenceTasklet,transactionManager)
                .allowStartIfComplete(true)
                .build();
    }

}
