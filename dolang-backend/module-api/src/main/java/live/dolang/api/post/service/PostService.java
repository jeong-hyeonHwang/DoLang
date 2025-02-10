package live.dolang.api.post.service;

import jakarta.annotation.PostConstruct;
import live.dolang.api.post.dto.BookmarkDataDto;
import live.dolang.core.domain.date_sentence.DateSentence;
import live.dolang.core.domain.date_sentence.repository.DateSentenceRepository;
import live.dolang.core.domain.user.User;
import live.dolang.core.domain.user.repository.UserRepository;
import live.dolang.core.domain.user_date_sentence.UserDateSentence;
import live.dolang.core.domain.user_date_sentence.repository.UserDateSentenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
@Service
@RequiredArgsConstructor
public class PostService {

    @Value("${spring.data.redis.feed.prefix}")
    private String feedPrefix;

    @Value("${spring.data.redis.count.postfix}")
    private String userSentenceBookmarkCountPostfix;

    @Value("${spring.data.redis.user.prefix}")
    private String userBookmarkPrefix;

    @Value("${spring.data.redis.bookmark.postfix}")
    private String bookmarkPostfix;


    private final UserDateSentenceRepository userDateSentenceRepository;
    private final UserRepository userRepository;
    private final DateSentenceRepository dateSentenceRepository;

    private final RedisTemplate<String, Object> redisTemplate;
    private ZSetOperations<String, Object> zSetOperations;
    private HashOperations<String, Object, Object> hashOperations;
    private final HashOperations<String, String, BookmarkDataDto> bookmarkHashOperations;


    @PostConstruct
    public void init() {
        hashOperations = redisTemplate.opsForHash();
        zSetOperations = redisTemplate.opsForZSet();
    }

    @Transactional
    public Boolean createUserDateSentence(Integer userId, Integer dateSentenceId, String userDateSentencesUrl) {
        // 사용자 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 사용자가 없습니다: " + userId));

        // 날짜별 문장 조회
        DateSentence dateSentence = dateSentenceRepository.findById(dateSentenceId)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 날짜별 문장이 없습니다: " + dateSentenceId));

        // 새로운 피드 객체 생성 및 저장
        UserDateSentence userDateSentence = UserDateSentence.builder()
                .user(user)
                .dateSentence(dateSentence)
                .userDateSentencesUrl(userDateSentencesUrl)
                .build();

        userDateSentence = userDateSentenceRepository.save(userDateSentence);

        // Redis에 정보 저장
        return saveToRedis(user.getId(), dateSentence.getId(), userDateSentence.getId());
    }

    /**
     * Redis에 피드 정보 저장
     */

    private boolean saveToRedis(Integer userId, Integer feedId, Integer postId) {
        String hashKey = getFeedBookmarkKey(feedId);
        hashOperations.put(hashKey, postId.toString(),  0L);
        // Sorted Set에도 추가
        String sortedKey = getFeedBookmarkSortedKey(feedId);
        zSetOperations.add(sortedKey, postId.toString(), 0);

        String dataKey = getDataKey(userId, feedId);
        String field = postId.toString();
        String dirtySetKey = getDirtySetKey(userId, feedId);

        long timestamp = Instant.now().getEpochSecond();


        BookmarkDataDto newData = new BookmarkDataDto(false, timestamp);

        // 메인 해시 업데이트
        bookmarkHashOperations.put(dataKey, field, newData);
        // 변경된 항목을 dirty 세트에 추가하여 변경됨을 표시
        redisTemplate.opsForSet().add(dirtySetKey, field);

        // 만료 시간 설정 (예: 1일)
        redisTemplate.expire(dataKey, Duration.ofDays(1));
        redisTemplate.expire(dirtySetKey, Duration.ofDays(1));

        return true;
    }

    private String getFeedBookmarkKey(Integer feedId) {
        return feedPrefix + ":" +
                bookmarkPostfix + ":" +
                feedId + ":" + userSentenceBookmarkCountPostfix;
    }

    private String getDataKey(Integer userId, Integer feedId) {
        return userBookmarkPrefix + ":" +
                userId + ":" +
                feedPrefix + ":" +
                feedId + ":" +
                bookmarkPostfix;
    }

    private String getFeedBookmarkSortedKey(Integer feedId) {
        return getFeedBookmarkKey(feedId) + ":sorted";
    }

    private String getDirtySetKey(Integer userId, Integer feedId) {
        return getDataKey(userId, feedId) + ":dirty";
    }
}


