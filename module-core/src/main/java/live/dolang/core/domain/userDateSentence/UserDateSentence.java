package live.dolang.core.domain.userDateSentence;

import jakarta.persistence.*;
import live.dolang.core.domain.dateSentence.DateSentence;
import live.dolang.core.domain.user.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_date_sentences", schema = "dolang")
public class UserDateSentence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_date_sentence_id", columnDefinition = "INT")
    private Integer userDateSentenceId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "date_sentence_id", nullable = false)
    private DateSentence dateSentence;

    @Column(name = "user_date_sentences_url", columnDefinition = "VARCHAR(255)")
    private String userDateSentencesUrl;

}
