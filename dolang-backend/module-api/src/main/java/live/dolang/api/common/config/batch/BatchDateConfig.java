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
public class BatchDateConfig {
    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager;
    private final UpdateDateTasklet updateDateTasklet;

    /**
     * Job 설정
     */
    @Bean
    public Job updateDate() {
        return new JobBuilder("updateDate", jobRepository)
                .start(updateDateStep())
                .build();
    }

    /**
     *  Step 단계 설정
     */
    @Bean
    public Step updateDateStep() {
        return new StepBuilder("updateDateStep",jobRepository)
                .tasklet(updateDateTasklet,transactionManager)
                .allowStartIfComplete(true)
                .build();
    }

}
