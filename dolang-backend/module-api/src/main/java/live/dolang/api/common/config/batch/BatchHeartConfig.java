package live.dolang.api.common.config.batch;

import live.dolang.api.post.dto.HeartDataDto;
import live.dolang.core.domain.date_sentence.DateSentence;
import live.dolang.core.domain.user.User;
import live.dolang.core.domain.user_date_sentence.UserDateSentence;
import live.dolang.core.domain.user_sentence_like_log.UserSentenceLikeLog;
import live.dolang.core.domain.user_sentence_like_log.repository.UserSentenceLikeLogRepository;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.DuplicateJobException;
import org.springframework.batch.core.configuration.JobRegistry;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.core.configuration.support.ReferenceJobFactory;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.batch.item.support.IteratorItemReader;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.*;
import org.springframework.transaction.PlatformTransactionManager;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class BatchHeartConfig {

    @Value("${spring.data.redis.user.prefix}")
    private String userPrefix; // 예: "user:"

    @Value("${spring.data.redis.heart.postfix}")
    private String heartPostfix;    // 예: ":heart"

    private final JobRegistry jobRegistry;
    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager;
    private final RedisTemplate<String, Integer> redisTemplate;
    private final UserSentenceLikeLogRepository userSentenceLikeLogRepository;

    /**
     * Redis 에 저장된 dirty 플래그가 있는 북마크 데이터를 DB에 반영하는 Job
     */
    @Bean
    public Job redisHeartToDatabaseJob() throws DuplicateJobException {
        Job job = new JobBuilder("redisHeartToDatabaseJob", jobRepository)
                .start(redisHeartToDatabaseStep())
                .build();
        jobRegistry.register(new ReferenceJobFactory(job));
        return job;
    }

    /**
     * Step 구성
     * Chunk 단위로 HeartLogWrapper 를 읽고 처리한 후 DB 저장 및 dirty 플래그 제거
     */
    @Bean
    public Step redisHeartToDatabaseStep() {
        return new StepBuilder("redisHeartToDatabaseStep", jobRepository)
                .<HeartLogWrapper, HeartLogWrapper>chunk(100, transactionManager)
                .reader(redisHeartItemReader(redisTemplate))
                .processor(redisHeartItemProcessor())
                .writer(redisHeartItemWriter())
                .faultTolerant()
                .retryLimit(3)
                .retry(Exception.class)
                .skipLimit(10)
                .skip(Exception.class)
                .build();
    }


    /**
     * Redis 에서 dirty 플래그가 있는 각 데이터 항목(키와 필드)을 읽어 {@link HeartLogWrapper} 목록을 생성
     * <p>
     * {@code heartKey} 에는 Hash 자료구조 ({@code UserDateSentenceId}, {@link HeartDataDto})
     * <br/>
     * K(User 가 DateSentence) 의 HK(UserDateSentence) 에 HV(좋아요를 했는지 안했는지)를 알 수 있다.
     * </p>
     *
     * <p>
     * {@code heartKey + dirty} 에는 Set 자료구조 {@code UserDateSentenceId}
     * <br/>
     * K(User 가 DateSentence) 의 V(UserDateSentence) 에 변경을 가했음을 의미한다.
     * </p>
     *
     * @param redisTemplate {@link RedisTemplate}
     * @return {@link ItemReader}
     */
    @Bean
    @StepScope
    public IteratorItemReader<HeartLogWrapper> redisHeartItemReader(RedisTemplate<String, Integer> redisTemplate) {

        List<HeartLogWrapper> wrapperList = new ArrayList<>();

        HashOperations<String, Integer, HeartDataDto> hashOperations = redisTemplate.opsForHash();
        SetOperations<String, Integer> setOperations = redisTemplate.opsForSet();

        // heartKey 패턴: "user:*:feed:*:heartPostfix"
        String heartKeyPattern = userPrefix + "*:feed:*" + heartPostfix;
        try (Cursor<String> c = redisTemplate.scan(
                ScanOptions.scanOptions().match(heartKeyPattern).count(100).build()
        )) {
            // heartKey 패턴에 해당되는 모든 heartKey 에 대하여
            c.forEachRemaining(heartKey -> {
                // 패턴으로 해석 보장됨
                String[] parts = heartKey.split(":");
                int userId = Integer.parseInt(parts[1]);
                int feedId = Integer.parseInt(parts[3]);

                // heartDirtyKey 키: heartKey + ":dirty"
                String heartDirtyKey = heartKey + ":dirty";
                try (Cursor<Integer> cc = setOperations.scan(
                        heartDirtyKey,
                        ScanOptions.scanOptions().count(50).build()
                )) {
                    // 각 userDateSentenceId 에 대하여
                    cc.forEachRemaining(userDateSentenceId -> {
                        try {
                            HeartDataDto heartDataDto = hashOperations.get(heartKey, userDateSentenceId);
                            if (heartDataDto != null) {
                                wrapperList.add(
                                        HeartLogWrapper.builder()
                                                .log(
                                                        UserSentenceLikeLog.builder()
                                                                .user(User.builder().id(userId).build())
                                                                .dateSentence(DateSentence.builder().id(feedId).build())
                                                                .userDateSentence(UserDateSentence.builder().id(userDateSentenceId).build())
                                                                .likeYn(heartDataDto.isHearted())
                                                                .createdAt(Instant.ofEpochSecond(heartDataDto.getTimestamp()))
                                                                .build()
                                                )
                                                .heartKey(heartKey)
                                                .userDateSentenceId(userDateSentenceId)
                                                .build()
                                );
                            }
                        } catch (Exception e) {
                            log.error("Error processing HeartDataDto for key: {}", heartKey, e);
                        }
                    });
                }

            });
        }

        return new IteratorItemReader<>(wrapperList);
    }

    @Bean
    public ItemProcessor<HeartLogWrapper, HeartLogWrapper> redisHeartItemProcessor() {
        return wrapper -> wrapper;
    }

    //ItemWriter: 로그를 DB에 저장한 후, 해당 dirty 플래그를 Redis 에서 제거
    @Bean
    public ItemWriter<HeartLogWrapper> redisHeartItemWriter() {
        return wrappers -> {

            List<? extends HeartLogWrapper> wrappersItems = wrappers.getItems();

            // DB 저장
            userSentenceLikeLogRepository.saveAll(
                    wrappersItems.stream().map(HeartLogWrapper::getLog).toList()
            );

            // 저장 후, 각 항목의 dirty 플래그 제거
            for (HeartLogWrapper wrapper : wrappersItems) {
                String dirtySetKey = wrapper.getHeartKey() + ":dirty";
                redisTemplate.opsForSet().remove(dirtySetKey, wrapper.getUserDateSentenceId());
            }
        };
    }

    /**
     * Wrapper 클래스: Redis 의 데이터 키, 필드와 DB에 저장할 로그 엔티티를 함께 보관
     */
    @Getter
    @Builder
    public static class HeartLogWrapper {
        private final UserSentenceLikeLog log;
        private final String heartKey;
        private final Integer userDateSentenceId;
    }
}