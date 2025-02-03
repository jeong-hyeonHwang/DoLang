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
    @Column(name = "create_at", columnDefinition = "TIMESTAMP", nullable = false)
    private Instant createAt;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private UserProfile userProfile;

}
