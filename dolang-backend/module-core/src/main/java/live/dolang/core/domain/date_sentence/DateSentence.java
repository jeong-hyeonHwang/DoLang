package live.dolang.core.domain.date_sentence;

import jakarta.persistence.*;
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
@Table(name = "date_sentences")
public class DateSentence {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sentence_id")
    private Integer id;

    @Column(name = "sentence", columnDefinition = "VARCHAR(255)", nullable = false)
    private String sentence;

    @Column(name = "date_id", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP", nullable = false)
    private Instant dateId;

    @Column(name = "level", columnDefinition = "CHAR(2)", nullable = false)
    private String level;
}