package live.dolang.api.common.config.batch;

import live.dolang.api.post.dto.BookmarkDataDto;
import live.dolang.core.domain.date_sentence.DateSentence;
import live.dolang.core.domain.user.User;
import live.dolang.core.domain.user_date_sentence.UserDateSentence;
import live.dolang.core.domain.user_sentence_bookmark_log.UserSentenceBookmarkLog;
import live.dolang.core.domain.user_sentence_bookmark_log.repository.UserSentenceBookmarkLogRepository;
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
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class BatchBookmarkConfig {

    @Value("${spring.data.redis.user.prefix}")
    private String userPrefix; // 예: "user:"

    @Value("${spring.data.redis.bookmark.postfix}")
    private String bookmarkPostfix;    // 예: ":bookmark"

    private final JobRegistry jobRegistry;
    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager;
    private final RedisTemplate<String, Integer> redisTemplate;
    private final UserSentenceBookmarkLogRepository userSentenceBookmarkLogRepository;

    /**
     * Redis 에 저장된 dirty 플래그가 있는 북마크 데이터를 DB에 반영하는 Job
     */
    @Bean
    public Job redisBookmarkToDatabaseJob() throws DuplicateJobException {
        Job job = new JobBuilder("redisBookmarkToDatabaseJob", jobRepository)
                .start(redisBookmarkToDatabaseStep())
                .build();
        jobRegistry.register(new ReferenceJobFactory(job));
        return job;
    }

    /**
     * Step 구성
     * Chunk 단위로 BookmarkLogWrapper 를 읽고 처리한 후 DB 저장 및 dirty 플래그 제거
     */
    @Bean
    public Step redisBookmarkToDatabaseStep() {
        return new StepBuilder("redisBookmarkToDatabaseStep", jobRepository)
                .<BookmarkLogWrapper, BookmarkLogWrapper>chunk(100, transactionManager)
                .reader(redisBookmarkItemReader(redisTemplate))
                .processor(redisBookmarkItemProcessor())
                .writer(redisItemWriter())
                .faultTolerant()
                .retryLimit(3)
                .retry(Exception.class)
                .skipLimit(10)
                .skip(Exception.class)
                .build();
    }

    /**
     * Redis 에서 dirty 플래그가 있는 각 데이터 항목(키와 필드)을 읽어 {@link BookmarkLogWrapper} 목록을 생성
     * <p>
     * {@code bookmarkKey} 에는 Hash 자료구조 ({@code UserDateSentenceId}, {@link BookmarkDataDto})
     * <br/>
     * K(User 가 DateSentence) 의 HK(UserDateSentence) 에 HV(북마크를 했는지 안했는지)를 알 수 있다.
     * </p>
     *
     * <p>
     * {@code bookmarkKey + dirty} 에는 Set 자료구조 {@code UserDateSentenceId}
     * <br/>
     * K(User 가 DateSentence) 의 V(UserDateSentence) 에 변경을 가했음을 의미한다.
     * </p>
     *
     * @param redisTemplate {@link RedisTemplate}
     * @return {@link ItemReader}
     */
    @Bean
    @StepScope
    public IteratorItemReader<BookmarkLogWrapper> redisBookmarkItemReader(RedisTemplate<String, Integer> redisTemplate) {

        List<BookmarkLogWrapper> wrapperList = new ArrayList<>();

        HashOperations<String, Integer, BookmarkDataDto> hashOperations = redisTemplate.opsForHash();
        SetOperations<String, Integer> setOperations = redisTemplate.opsForSet();

        // bookmark 패턴: "user:*:feed:*:bookmarkPostfix"
        String bookmarkKeyPattern = userPrefix + "*:feed:*" + bookmarkPostfix;
        try (Cursor<String> c = redisTemplate.scan(
                ScanOptions.scanOptions().match(bookmarkKeyPattern).count(100).build()
        )) {
            // bookmark 패턴에 해당되는 모든 bookmark 에 대하여
            c.forEachRemaining(bookmark -> {
                // 패턴으로 해석 보장됨
                String[] parts = bookmark.split(":");
                int userId = Integer.parseInt(parts[1]);
                int feedId = Integer.parseInt(parts[3]);

                // bookmarkDirtyKey 키: bookmark + ":dirty"
                String bookmarkDirtyKey = bookmark + ":dirty";
                try (Cursor<Integer> cc = setOperations.scan(
                        bookmarkDirtyKey,
                        ScanOptions.scanOptions().count(50).build()
                )) {
                    // 각 userDateSentenceId 에 대하여
                    cc.forEachRemaining(userDateSentenceId -> {
                        try {
                            BookmarkDataDto bookmarkDataDto = hashOperations.get(bookmark, userDateSentenceId);
                            if (bookmarkDataDto != null) {
                                wrapperList.add(
                                        BookmarkLogWrapper.builder()
                                                .log(
                                                        UserSentenceBookmarkLog.builder()
                                                                .user(User.builder().id(userId).build())
                                                                .dateSentence(DateSentence.builder().id(feedId).build())
                                                                .userDateSentence(UserDateSentence.builder().id(userDateSentenceId).build())
                                                                .bookmarkYn(bookmarkDataDto.isBookmarked())
                                                                .createdAt(Instant.ofEpochSecond(bookmarkDataDto.getTimestamp()).truncatedTo(ChronoUnit.DAYS))
                                                                .build()
                                                )
                                                .bookmarkKey(bookmark)
                                                .userDateSentenceId(userDateSentenceId)
                                                .build()
                                );
                            }
                        } catch (Exception e) {
                            log.error("Error processing BookmarkDataDto for key: {}", bookmark, e);
                        }
                    });
                }

            });
        }

        return new IteratorItemReader<>(wrapperList);

    }

    @Bean
    public ItemProcessor<BookmarkLogWrapper, BookmarkLogWrapper> redisBookmarkItemProcessor() {
        return wrapper -> wrapper;
    }

    //ItemWriter: 로그를 DB에 저장한 후, 해당 dirty 플래그를 Redis 에서 제거
    @Bean
    public ItemWriter<BookmarkLogWrapper> redisItemWriter() {
        return wrappers -> {

            List<? extends BookmarkLogWrapper> wrappersItems = wrappers.getItems();

            // DB 저장
            userSentenceBookmarkLogRepository.saveAll(
                    wrappersItems.stream().map(BookmarkLogWrapper::getLog).toList()
            );

            // 저장 후, 각 항목의 dirty 플래그 제거
            for (BookmarkLogWrapper wrapper : wrappers) {
                String dirtySetKey = wrapper.getBookmarkKey() + ":dirty";
                redisTemplate.opsForSet().remove(dirtySetKey, wrapper.getUserDateSentenceId());
            }
        };
    }

    /**
     * Wrapper 클래스: Redis 의 데이터 키, 필드와 DB에 저장할 로그 엔티티를 함께 보관
     */
    @Getter
    @Builder
    public static class BookmarkLogWrapper {
        private final UserSentenceBookmarkLog log;
        private final String bookmarkKey;
        private final Integer userDateSentenceId;
    }
}