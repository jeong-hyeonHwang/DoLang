package live.dolang.core.domain.user_tag;

import jakarta.persistence.*;
import live.dolang.core.domain.tag.Tag;
import live.dolang.core.domain.user.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_tags", uniqueConstraints = @UniqueConstraint(
        name = "uk_user_tag_user_id_tag_id",
        columnNames = {"user_id", "tag_id"}
), schema = "dolang")
public class UserTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_tag_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_user_tag_user_id_to_user_id"))
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tag_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_user_tag_tag_id_to_tag_id"))
    private Tag tag;

}
