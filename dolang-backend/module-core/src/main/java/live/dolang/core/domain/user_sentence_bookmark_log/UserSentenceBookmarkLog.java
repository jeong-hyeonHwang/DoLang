package live.dolang.core.domain.user_sentence_bookmark_log;

import jakarta.persistence.*;
import live.dolang.core.domain.user.User;
import live.dolang.core.domain.user_date_sentence.UserDateSentence;
import lombok.*;

import java.time.Instant;

@Getter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_sentence_bookmark_logs", schema = "dolang",
        indexes = {
                // 최신 데이터 조회를 위한 복합 인덱스: user_id, user_date_sentence_id, create_at
                @Index(name = "idx_user_sentence", columnList = "user_id, user_date_sentence_id, created_at"),
                // 특정 유저의 데이터 빠른 조회를 위한 단위 인덱스 )
                @Index(name = "idx_user", columnList = "user_id")
        }
        )

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

    @Column(name = "created_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP", nullable = false)
    private Instant createdAt;
}