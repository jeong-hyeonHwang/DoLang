package live.dolang.core.domain.language_level;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "language_levels", schema = "dolang")
public class LanguageLevel {
    @Id
    @Column(name = "language_level_id", columnDefinition = "CHAR(2)")
    private String id;
}
