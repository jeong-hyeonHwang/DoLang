package live.dolang.core.domain.language_level.tag_translation;

import jakarta.persistence.*;
import live.dolang.core.domain.tag.Tag;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tag_translations", schema = "dolang")
public class TagTranslation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tag_translation_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tag_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_tag_translations_tag_id_to_tag_id"))
    private Tag tag;

    @Column(name = "native_language_id", nullable = false, length = 2, columnDefinition = "CHAR(2)")
    private String nativeLanguageId;

    @Column(name = "translated_name", nullable = false, length = 100)
    private String translatedName;

}
