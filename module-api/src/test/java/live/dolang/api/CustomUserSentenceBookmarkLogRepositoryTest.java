package live.dolang.api;

import live.dolang.api.post.dto.BookmarkCountDTO;
import live.dolang.api.post.repository.CustomUserSentenceBookmarkLogRepository;
import live.dolang.core.domain.date_sentence.DateSentence;
import live.dolang.core.domain.date_sentence.repository.DateSentenceRepository;
import live.dolang.core.domain.user.User;
import live.dolang.core.domain.user.repository.UserRepository;
import live.dolang.core.domain.user_date_sentence.UserDateSentence;
import live.dolang.core.domain.user_date_sentence.repository.UserDateSentenceRepository;
import live.dolang.core.domain.user_sentence_bookmark_log.UserSentenceBookmarkLog;
import live.dolang.core.domain.user_sentence_bookmark_log.repository.UserSentenceBookmarkLogRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;

@SpringBootTest
@Transactional
class CustomUserSentenceBookmarkLogRepositoryTest {

    @Autowired
    private CustomUserSentenceBookmarkLogRepository customUserSentenceBookmarkLogRepository;

    @Autowired
    private UserSentenceBookmarkLogRepository userSentenceBookmarkLogRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private DateSentenceRepository dateSentenceRepository;
    @Autowired
    private UserDateSentenceRepository userDateSentenceRepository;

    private UserDateSentence userDateSentence1;
    private UserDateSentence userDateSentence2;

    @BeforeEach
    void setup() {
        // 1) User 1 생성
        User testUser1 = User.builder()
                .email("user1@example.com")
                .googleId("google-1")
                .createAt(Instant.from(LocalDateTime.now())) // TODO: Redis timestamp 값으로 수정
                .build();
        userRepository.save(testUser1);

        // 2) User 2 생성
        User testUser2 = User.builder()
                .email("user2@example.com")
                .googleId("google-2")
                .createAt(Instant.from(LocalDateTime.now())) // TODO: Redis timestamp 값으로 수정
                .build();
        userRepository.save(testUser2);

        // 3) DateSentence 1 생성
        DateSentence dateSentence1 = DateSentence.builder()
                .sentence("Example sentence 1")
                .dateId(LocalDateTime.now())
                .level("A1")
                .build();
        dateSentenceRepository.save(dateSentence1);

        // 4) DateSentence 2 생성
        DateSentence dateSentence2 = DateSentence.builder()
                .sentence("Example sentence 2")
                .dateId(LocalDateTime.now())
                .level("B1")
                .build();
        dateSentenceRepository.save(dateSentence2);

        // 5) UserDateSentence 1 생성 (user1이 dateSentence1 사용)
        userDateSentence1 = UserDateSentence.builder()
                .user(testUser1)
                .dateSentence(dateSentence1) // ✅ DateSentence 연결
                .userDateSentencesUrl("url-1")
                .build();
        userDateSentenceRepository.save(userDateSentence1);

        // 6) UserDateSentence 2 생성 (user2가 dateSentence2 사용)
        userDateSentence2 = UserDateSentence.builder()
                .user(testUser2)
                .dateSentence(dateSentence2) // ✅ DateSentence 연결
                .userDateSentencesUrl("url-2")
                .build();
        userDateSentenceRepository.save(userDateSentence2);

        // 7) BookmarkLog 1 (user1 -> userDateSentence1)
        UserSentenceBookmarkLog bookmarkLog1 = UserSentenceBookmarkLog.builder()
                .user(testUser1)
                .userDateSentence(userDateSentence1)
                .bookmarkYn(true)
                .createAt(LocalDateTime.now())
                .build();
        userSentenceBookmarkLogRepository.save(bookmarkLog1);

        // 8) BookmarkLog 2 (user2 -> userDateSentence1)
        UserSentenceBookmarkLog bookmarkLog2 = UserSentenceBookmarkLog.builder()
                .user(testUser2)
                .userDateSentence(userDateSentence1)
                .bookmarkYn(true)
                .createAt(LocalDateTime.now())
                .build();
        userSentenceBookmarkLogRepository.save(bookmarkLog2);

        // 9) BookmarkLog 3 (user2 -> userDateSentence2)
        UserSentenceBookmarkLog bookmarkLog3 = UserSentenceBookmarkLog.builder()
                .user(testUser2)
                .userDateSentence(userDateSentence2)
                .bookmarkYn(true)
                .createAt(LocalDateTime.now())
                .build();
        userSentenceBookmarkLogRepository.save(bookmarkLog3);

        // 10) BookmarkLog 4 (user1 -> userDateSentence2 but bookmarkYn=false)
        UserSentenceBookmarkLog bookmarkLog4 = UserSentenceBookmarkLog.builder()
                .user(testUser1)
                .userDateSentence(userDateSentence2)
                .bookmarkYn(false) // ✅ false 처리
                .createAt(LocalDateTime.now())
                .build();
        userSentenceBookmarkLogRepository.save(bookmarkLog4);
    }

    @Test
    void testFindAllPostBookmarkCounts() {
        // when
        List<BookmarkCountDTO> results = customUserSentenceBookmarkLogRepository.findAllPostBookmarkCountsRaw();

        // then
        assertThat(results).hasSize(2);
        // ✅ userDateSentence1, userDateSentence2 각각 group by 됨 (bookmarkYn=true 만 집계됨)

        // 검증 로직
        for (BookmarkCountDTO dto : results) {
            System.out.println("postId=" + dto.getPostId() + ", bookmarkCount=" + dto.getBookmarkCount());
            // postId = userDateSentence1.getUserDateSentenceId(), userDateSentence2.getUserDateSentenceId()
            // bookmarkCount = 2 for userDateSentence1, 1 for userDateSentence2
        }

        // 예시 검증
        Optional<BookmarkCountDTO> ds1 = results.stream()
                .filter(r -> r.getPostId().equals(userDateSentence1.getUserDateSentenceId()))
                .findFirst();
        Optional<BookmarkCountDTO> ds2 = results.stream()
                .filter(r -> r.getPostId().equals(userDateSentence2.getUserDateSentenceId()))
                .findFirst();

        assertThat(ds1).isPresent();
        assertThat(ds1.isPresent()).isEqualTo(2);

        assertThat(ds2).isPresent();
        assertThat(ds2.isPresent()).isEqualTo(1);
    }
}
