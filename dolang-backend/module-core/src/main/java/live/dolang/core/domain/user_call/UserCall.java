package live.dolang.core.domain.user_call;

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
@Table(name = "user_calls", schema = "dolang")
public class UserCall {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_call_id", columnDefinition = "INT")
    private Integer id;

    @Column(name = "started_at", columnDefinition = "TIMESTAMP", updatable = false, nullable = false)
    private Instant startedAt;

    @Column(name = "ended_at", columnDefinition = "TIMESTAMP", nullable = false)
    private Instant endedAt;

    /**
     * 통화 종료 시각을 현재 시각으로 지정합니다.
     */
    public void endCall() {
        this.endedAt = Instant.now();
    }

}
