package live.dolang.api.call.dto;


import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@Schema(description = "통화기록 페이징 요청 객체")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CallPageRequest {

    @Schema(description = "지금이 몇 페이지 인가?")
    int page;

    @Schema(description = "페이지의 총 크기는 어떻게 되는가?")
    int size;

    public Pageable toPageable() {
        return PageRequest.of(page, size);
    }

}
