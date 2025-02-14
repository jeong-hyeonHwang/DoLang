package live.dolang.api.call.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Schema(description = "통화 기록 페이징 내용")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CallPageDto {

    @Schema(description = "통화 시작 시간")
    private Instant startedAt;

    @Schema(description = "통화 종료 시간")
    private Instant endedAt;

    @Schema(description = "내 정보")
    private CallUserDto me;

    @Schema(description = "매칭된 상대 정보")
    private CallUserDto matchedUser;

}
