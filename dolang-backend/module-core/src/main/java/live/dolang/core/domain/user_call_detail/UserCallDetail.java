package live.dolang.core.domain.user_call_detail;

import jakarta.persistence.*;
import live.dolang.core.domain.user.User;
import live.dolang.core.domain.user_call.UserCall;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_call_details", schema = "dolang")
public class UserCallDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_call_detail_id", columnDefinition = "INT")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_user_call_details_user_id_to_user_id"))
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE, optional = false)
    @JoinColumn(name = "user_call_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_user_call_details_user_call_id_to_user_call_id"))
    private UserCall userCall;

    @Column(name = "native_language_id", length = 2, columnDefinition = "CHAR(2)")
    private String nativeLanguageId;

    @Column(name = "interest_language_id", length = 2, columnDefinition = "CHAR(2)")
    private String interestLanguageId;

}
