package live.dolang.api.call.dto;


import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@Schema(description = "통화기록 페이징 요청 객체")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ParameterObject
public class CallPageRequest {

    @Schema(description = "지금이 몇 페이지 인가?", requiredMode = Schema.RequiredMode.REQUIRED, example = "0", defaultValue = "0")
    @Min(0)
    int page = 0;

    @Schema(description = "페이지의 총 크기는 어떻게 되는가?", requiredMode = Schema.RequiredMode.REQUIRED, example = "10", defaultValue = "10")
    @Min(1)
    @Max(20)
    int size = 10;

    public Pageable toPageable() {
        return PageRequest.of(page, size);
    }

}
