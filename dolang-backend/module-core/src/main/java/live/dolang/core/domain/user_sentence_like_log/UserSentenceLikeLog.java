package live.dolang.core.domain.user_sentence_like_log;

import jakarta.persistence.*;
import live.dolang.core.domain.date_sentence.DateSentence;
import live.dolang.core.domain.user.User;
import live.dolang.core.domain.user_date_sentence.UserDateSentence;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Getter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_sentence_like_logs", schema = "dolang")
public class UserSentenceLikeLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_sentence_like_log_id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "date_sentence_id", nullable = false)
    private DateSentence dateSentence;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_date_sentence_id", nullable = false)
    private UserDateSentence userDateSentence;

    @Column(name = "like_yn", columnDefinition = "TINYINT(1)", nullable = false)
    private boolean likeYn;

    @Column(name = "created_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP", nullable = false)
    private Instant createdAt;
}