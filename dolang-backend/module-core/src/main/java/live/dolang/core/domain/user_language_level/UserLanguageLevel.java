package live.dolang.core.domain.user_language_level;

import jakarta.persistence.*;
import live.dolang.core.domain.user.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_language_levels")
public class UserLanguageLevel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_language_level_id")
    private Integer userLanguageLevelId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "language_level_id", length = 2, nullable = false, columnDefinition = "CHAR(2)")
    private String languageLevelId;

    @Column(name = "language_id", length = 2, nullable = false, columnDefinition = "CHAR(2)")
    private String languageId;

    public void updateLanguageLevelId(String newLanguageLevelId) {
        this.languageLevelId = newLanguageLevelId;
    }
}

