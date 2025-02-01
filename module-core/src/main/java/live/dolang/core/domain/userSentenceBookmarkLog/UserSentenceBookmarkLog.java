package live.dolang.core.domain.userSentenceBookmarkLog;

import jakarta.persistence.*;
import live.dolang.core.domain.user.User;
import live.dolang.core.domain.userDateSentence.UserDateSentence;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_sentence_like_logs", schema = "dolang")
public class UserSentenceBookmarkLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_sentence_bookmark_log_id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_date_sentence_id", nullable = false)
    private UserDateSentence userDateSentence;

    @Column(name = "bookmark_yn", columnDefinition = "TINYINT(1)", nullable = false)
    private boolean bookmarkYn;

    @Column(name = "create_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP", nullable = false)
    private LocalDateTime createAt;
}