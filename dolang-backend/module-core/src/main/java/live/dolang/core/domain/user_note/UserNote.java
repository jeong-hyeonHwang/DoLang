package live.dolang.core.domain.user_note;

import jakarta.persistence.*;
import live.dolang.core.domain.user.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Getter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_notes", schema = "dolang")
public class UserNote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_note_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", foreignKey = @ForeignKey(name = "fk_user_note_user_id_to_user_id"))
    private User user;

    @Column(name = "native_note", nullable = false)
    private String nativeNote;

    @Column(name = "interest_note", nullable = false)
    private String interestNote;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private Instant createdAt;

    @Column(name = "native_language_id", length = 2)
    private String nativeLanguageId;

    @Column(name = "interest_language_id", length = 2)
    private String interestLanguageId;

}
