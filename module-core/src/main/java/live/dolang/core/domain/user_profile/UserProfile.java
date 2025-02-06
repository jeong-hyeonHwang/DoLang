package live.dolang.core.domain.user_profile;

import jakarta.persistence.*;
import live.dolang.core.domain.user.User;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Getter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_profiles", schema = "dolang")
public class UserProfile {

    @Id
    @Column(name = "user_id")
    private Integer userId;

    @OneToOne(mappedBy = "userProfile", fetch = FetchType.LAZY)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", length = 1, columnDefinition = "CHAR(1)")
    private Gender gender;

    @Column(name = "profile_image_url")
    private String profileImageUrl;

    @Column(name = "nickname", length = 50)
    private String nickname;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false, columnDefinition = "TIMESTAMP")
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false, columnDefinition = "TIMESTAMP")
    private Instant updatedAt;

    @Column(name = "country_id", length = 2, columnDefinition = "CHAR(2)")
    private String countryId;

    @Column(name = "native_language_id", length = 2, columnDefinition = "CHAR(2)")
    private String nativeLanguageId;

    @Column(name = "interest_language_id", length = 2, columnDefinition = "CHAR(2)")
    private String interestLanguageId;

    public enum Gender {
        M, F
    }
}
