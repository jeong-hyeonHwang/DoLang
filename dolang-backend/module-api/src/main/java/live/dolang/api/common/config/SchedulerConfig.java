package live.dolang.api.common.config;

import lombok.RequiredArgsConstructor;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@Configuration
@EnableScheduling
@RequiredArgsConstructor
public class SchedulerConfig {

    private final JobLauncher jobLauncher;
    private final Job redisBookmarkToDatabaseJob;
    private final Job redisHeartToDatabaseJob;

    @Scheduled(cron = "0 */1 * * * ?")
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
}