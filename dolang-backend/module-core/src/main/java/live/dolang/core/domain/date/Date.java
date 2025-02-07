package live.dolang.core.domain.date;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Getter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "dates", schema = "dolang")
public class Date {

    @Id
    @Column(name = "date_id", columnDefinition = "TIMESTAMP")
    private Instant id;
}
