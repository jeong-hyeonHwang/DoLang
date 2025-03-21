package live.dolang.api.common.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.*;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.support.BeanDefinitionRegistryPostProcessor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@Slf4j
@Configuration
@EnableScheduling
@RequiredArgsConstructor
public class SchedulerConfig {

    private final JobLauncher jobLauncher;
    private final Job redisBookmarkToDatabaseJob;
    private final Job redisHeartToDatabaseJob;
    private final Job updateDateSentence;
    private final Job updateDate;

    @Scheduled(cron = "0 */1 * * * ?") // 1분마다 실행
    public void runBatchJob() {
        try {
            // Bookmark 배치 작업 실행
            jobLauncher.run(redisBookmarkToDatabaseJob, new JobParametersBuilder()
                    .addLong("bookmarkTimestamp", System.currentTimeMillis())
                    .toJobParameters());

            // Heart 배치 작업 실행
            jobLauncher.run(redisHeartToDatabaseJob, new JobParametersBuilder()
                    .addLong("heartTimestamp", System.currentTimeMillis())
                    .toJobParameters());
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    @Scheduled(cron = "0 0 0 * * ?") // 매일 00:00에 실행
    public void runUpdateDateSentence() {
        try {
            log.info("스케줄러 실행 시작==============");
            // 첫 번째 Job 실행
            JobExecution updateDateExecution = jobLauncher.run(updateDate, new JobParameters());
            if (updateDateExecution.getStatus() == BatchStatus.COMPLETED) {
                // 두 번째 Job 실행
                JobExecution updateDateSentenceExecution = jobLauncher.run(updateDateSentence, new JobParameters());
                if (updateDateSentenceExecution.getStatus() != BatchStatus.COMPLETED) {
                    log.error("updateDateSentence 실패");
                }
            } else {
                log.error("updateDate 실패 -> updateDateSentence 실행 불가");
            }

        } catch (Exception e) {
            log.error("Batch 실행 중 예외 발생: {}", e.getMessage(), e);
        }
    }

    @Bean
    public static BeanDefinitionRegistryPostProcessor jobRegistryBeanPostProcessorRemover() {
        return registry -> registry.removeBeanDefinition("jobRegistryBeanPostProcessor");
    }

}