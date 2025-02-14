package live.dolang.api.call.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Schema(description = "통화 시작 요청 객체")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StartCallRequest {

    @Schema(description = "매칭된 상대방 사용자 ID")
    @NotNull
    private Integer matchedUserId;
}
