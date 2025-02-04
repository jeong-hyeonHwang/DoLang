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
import org.springframework.batch.core.configuration.annotation.StepScope;
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
import java.util.Set;

@Configuration
@RequiredArgsConstructor
public class BatchConfig {

    @Value("${spring.data.redis.user.prefix}")
    private String userBookmarkPrefix;

    @Value("${spring.data.redis.bookmark.postfix}")
    private String bookmarkPostfix;

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
    @StepScope
    public ItemReader<UserSentenceBookmarkLog> redisItemReader() {
        List<UserSentenceBookmarkLog> logs = new ArrayList<>();
        // 메인 데이터 키 패턴 (예: "user:*:bookmarks:")
        String pattern = userBookmarkPrefix + "*" + bookmarkPostfix;
        Set<String> dataKeys = redisTemplate.keys(pattern);
        if (dataKeys == null) {
            dataKeys = Set.of();
        }

        for (String dataKey : dataKeys) {
            // 키 형식: "user:{userId}:{bookmarkPostfix}" — 여기서 userId를 추출
            String[] parts = dataKey.split(":");
            if (parts.length < 3) continue;
            int userId;
            try {
                userId = Integer.parseInt(parts[1]);
            } catch (NumberFormatException e) {
                continue;
            }

            String dirtySetKey = dataKey + ":dirty";
            Set<Object> dirtyFields = redisTemplate.opsForSet().members(dirtySetKey);
            if (dirtyFields == null || dirtyFields.isEmpty()) {
                continue;
            }

            // dirty 세트에 등록된 각 항목에 대해 처리
            for (Object fieldObj : dirtyFields) {
                String field = (String) fieldObj;
                Object value = redisTemplate.opsForHash().get(dataKey, field);
                if (!(value instanceof BookmarkDataDto bookmarkData)) {
                    assert value != null;
                    System.err.println("Unexpected data type in Redis: " + value.getClass());
                    continue;
                }
                User user = userRepository.findById(userId).orElse(null);
                if (user == null) {
                    System.err.println("User not found for ID: " + userId);
                    continue;
                }
                int sentenceId;
                try {
                    sentenceId = Integer.parseInt(field);
                } catch (NumberFormatException e) {
                    System.err.println("Invalid sentence ID format: " + field);
                    continue;
                }
                UserDateSentence userDateSentence = userDateSentenceRepository.findById(sentenceId).orElse(null);
                if (userDateSentence == null) {
                    System.err.println("UserDateSentence not found for ID: " + sentenceId);
                    continue;
                }
                LocalDateTime createdAt = LocalDateTime.ofEpochSecond(bookmarkData.getTimestamp(), 0, java.time.ZoneOffset.UTC);
                UserSentenceBookmarkLog log = UserSentenceBookmarkLog.builder()
                        .user(user)
                        .userDateSentence(userDateSentence)
                        .bookmarkYn(bookmarkData.isBookmarked())
                        .createdAt(createdAt)
                        .build();
                logs.add(log);
            }
        }
        return new IteratorItemReader<>(logs);
    }

    @Bean
    public ItemProcessor<UserSentenceBookmarkLog, UserSentenceBookmarkLog> redisItemProcessor() {
        return log -> log;
    }

    @Bean
    public ItemWriter<UserSentenceBookmarkLog> redisItemWriter() {
        return logs -> {
            userSentenceBookmarkLogRepository.saveAll(logs);
            // DB에 반영한 후, 해당 dirty 플래그를 제거
            for (UserSentenceBookmarkLog log : logs) {
                String dataKey = userBookmarkPrefix + log.getUser().getId() + bookmarkPostfix;
                String dirtySetKey = dataKey + ":dirty";
                String field = log.getUserDateSentence().getId().toString();
                redisTemplate.opsForSet().remove(dirtySetKey, field);
            }
        };
    }
}