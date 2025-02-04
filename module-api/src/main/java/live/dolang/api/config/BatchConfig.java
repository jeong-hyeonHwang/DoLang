package live.dolang.api.config;

import live.dolang.api.post.dto.BookmarkDataDto;
import live.dolang.core.domain.user.User;
import live.dolang.core.domain.user.repository.UserRepository;
import live.dolang.core.domain.user_date_sentence.UserDateSentence;
import live.dolang.core.domain.user_date_sentence.repository.UserDateSentenceRepository;
import live.dolang.core.domain.user_sentence_bookmark_log.UserSentenceBookmarkLog;
import live.dolang.core.domain.user_sentence_bookmark_log.repository.UserSentenceBookmarkLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
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
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.transaction.PlatformTransactionManager;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Configuration
@RequiredArgsConstructor
public class BatchConfig {

    @Value("${spring.data.redis.user.prefix}")
    private String userBookmarkPrefix;

    @Value("${spring.data.redis.bookmark.postfix}")
    private String userBookmarkPostfix;

    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager;
    private final RedisTemplate<String, Object> redisTemplate;
    private final UserRepository userRepository;
    private final UserDateSentenceRepository userDateSentenceRepository;
    private final UserSentenceBookmarkLogRepository userSentenceBookmarkLogRepository;

    @Bean
    public Job redisToDatabaseJob() {
        return new JobBuilder("redisToDatabaseJob", jobRepository)
                .start(redisToDatabaseStep())
                .build();
    }

    @Bean
    public Step redisToDatabaseStep() {
        return new StepBuilder("redisToDatabaseStep", jobRepository)
                .<UserSentenceBookmarkLog, UserSentenceBookmarkLog>chunk(100, transactionManager)
                .reader(redisItemReader())
                .processor(redisItemProcessor())
                .writer(redisItemWriter())
                .faultTolerant()
                .retryLimit(3)
                .retry(Exception.class)
                .skipLimit(10)
                .skip(Exception.class)
                .build();
    }

    @Bean
    public ItemReader<UserSentenceBookmarkLog> redisItemReader() {
        String pattern = userBookmarkPrefix + "*" + userBookmarkPostfix;
        Set<String> keys = redisTemplate.keys(pattern);
        List<UserSentenceBookmarkLog> logs = new ArrayList<>();

        for (String key : keys) {
            String userIdStr = key.split(":")[1];
            int userId;

            try {
                userId = Integer.parseInt(userIdStr);
            } catch (NumberFormatException e) {
                System.err.println("Invalid user ID format: " + userIdStr);
                continue;
            }

            // User 엔티티 조회
            User user = userRepository.findById(userId).orElse(null);
            if (user == null) {
                System.err.println("User not found for ID: " + userId);
                continue;
            }

            // Redis에서 해시 데이터 조회 (e.g., {"sentence1": true, "sentence2": false})
            Map<Object, Object> likeData = redisTemplate.opsForHash().entries(key);

            for (Map.Entry<Object, Object> entry : likeData.entrySet()) {
                String sentenceIdStr = (String) entry.getKey();
                int sentenceId;

                try {
                    sentenceId = Integer.parseInt(sentenceIdStr);
                } catch (NumberFormatException e) {
                    System.err.println("Invalid sentence ID format: " + sentenceIdStr);
                    continue;
                }

                // UserDateSentence 엔티티 조회
                UserDateSentence userDateSentence = userDateSentenceRepository.findById(sentenceId).orElse(null);
                if (userDateSentence == null) {
                    System.err.println("UserDateSentence not found for ID: " + sentenceId);
                    continue;
                }

                Object value = entry.getValue();
                boolean bookmarkYn;
                LocalDateTime createdAt;

                if (value instanceof BookmarkDataDto bookmarkData) {
                    bookmarkYn = bookmarkData.isBookmarked();
                    createdAt = LocalDateTime.ofEpochSecond(bookmarkData.getTimestamp(), 0, java.time.ZoneOffset.UTC);
                } else {
                    System.err.println("Unexpected data type in Redis: " + value.getClass());
                    continue;
                }

                // UserSentenceBookmarkLog 생성 및 설정
                UserSentenceBookmarkLog log = UserSentenceBookmarkLog
                        .builder()
                        .user(user)
                        .userDateSentence(userDateSentence)
                        .bookmarkYn(bookmarkYn)

                        .createAt(createdAt)
                        .build();

                logs.add(log);
            }
        }
        return new IteratorItemReader<>(logs);
    }


    @Bean
    public ItemProcessor<UserSentenceBookmarkLog, UserSentenceBookmarkLog> redisItemProcessor() {
        return log -> {
            // 필요한 처리 로직 추가
            return log;
        };
    }

    @Bean
    public ItemWriter<UserSentenceBookmarkLog> redisItemWriter() {
        return userSentenceBookmarkLogRepository::saveAll;
    }
}
