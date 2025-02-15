package live.dolang.core.domain.user_sentence_bookmark;

import jakarta.persistence.*;
import live.dolang.core.domain.user.User;
import live.dolang.core.domain.user_date_sentence.UserDateSentence;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Getter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_sentence_bookmarks", indexes = {
        @Index(name = "idx_users_user_id", columnList = "user_id"),
        @Index(name = "idx_users_user_date_sentence_id", columnList = "user_date_sentence_id")
}, schema = "dolang")
public class UserSentenceBookmark {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_sentence_bookmark_id", columnDefinition = "INT")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_date_sentence_id", nullable = false)
    private UserDateSentence userDateSentence;
}