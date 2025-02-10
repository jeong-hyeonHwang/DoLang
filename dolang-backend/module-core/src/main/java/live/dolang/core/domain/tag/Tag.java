package live.dolang.core.domain.tag;

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
@Table(name = "tags", schema = "dolang",
        uniqueConstraints = @UniqueConstraint(columnNames = {"name", "native_language_id"}))
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tag_id")
    private Integer id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "native_language_id", length = 2, columnDefinition = "CHAR(2)")
    private String nativeLanguageId;

}
