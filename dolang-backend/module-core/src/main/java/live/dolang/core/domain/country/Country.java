package live.dolang.core.domain.country;

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
@Table(name = "countries", schema = "dolang")
public class Country {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "country_id", columnDefinition = "CHAR(2)")
    private String id;

    @Column(name = "national_flag_url", length = 512, unique = true, nullable = false)
    private String nationalFlagUrl;
}
