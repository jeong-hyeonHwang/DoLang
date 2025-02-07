package live.dolang.core.domain.language;

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
@Table(name = "languages", schema = "dolang")
public class Language {

    @Id
    @Column(name = "language_id", columnDefinition = "CHAR(2)")
    private String id;
}