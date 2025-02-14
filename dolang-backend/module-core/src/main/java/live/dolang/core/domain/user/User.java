package live.dolang.core.domain.user;

import jakarta.persistence.*;
import live.dolang.core.domain.user_profile.UserProfile;
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
@Table(name = "users", indexes = {
        @Index(name = "idx_users_google_id", columnList = "google_id", unique = true),
        @Index(name = "idx_users_email", columnList = "email", unique = true),
}, schema = "dolang")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", columnDefinition = "INT")
    private Integer id;

    @Column(name = "email", columnDefinition = "VARCHAR(100)", unique = true, nullable = false)
    private String email;

    @Column(name = "google_id", columnDefinition = "VARCHAR(255)", unique = true, nullable = false)
    private String googleId;

    @CreationTimestamp
    @Column(name = "created_at", columnDefinition = "TIMESTAMP", nullable = false)
    private Instant createdAt;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", foreignKey = @ForeignKey(name = "fk_user_profile_user_id_to_user_id"))
    private UserProfile userProfile;

    @Column(name = "is_deleted", columnDefinition = "TINYINT(1)", nullable = false)
    private boolean isDeleted;

    public void updateProfile(UserProfile newProfile) {
        this.userProfile.updateUserProfile(newProfile);
    }
    public void deleteUser() {
        this.isDeleted = true;
        this.userProfile.deleteUser();
    }
}
