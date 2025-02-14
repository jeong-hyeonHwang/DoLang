package live.dolang.api.call.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Schema(description = "통화 종료 요청 객체")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StopCallRequest {

    @Schema(description = "생성된 통화 기록 아이디 (2명의 사용자가 같은 통화기록 아이디를 가지게됨)", requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer callId;

}
