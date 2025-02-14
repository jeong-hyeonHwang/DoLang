package live.dolang.api.call.dto;


import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.util.List;

@Schema(description = "통화 기록 페이징 조회 결과")
@NoArgsConstructor
@Getter
public class CallPageResponse {

    @Schema(description = "현재 페이지 내용")
    private List<CallPageDto> content;

    @Schema(description = "지금이 몇 페이지 인가?")
    private int page;

    @Schema(description = "페이지의 총 크기는 어떻게 되는가?")
    private int size;

    @Schema(description = "실제 현재 페이지에 표시되는게 몇개인가?")
    private long totalElements;

    @Schema(description = "전체적으로 몇 페이지로 이루어져있는가?")
    private int totalPages;

    /**
     * {@link CallPageResponse} 생성자.
     * 주어진 {@link Page} 객체를 기반으로 페이징 정보를 설정합니다.
     *
     * @param page 변환할 페이지 객체 (Page<CallPageDto>).
     */
    public CallPageResponse(Page<CallPageDto> page) {
        this.content = page.getContent();
        this.page = page.getNumber();
        this.size = page.getSize();
        this.totalElements = page.getTotalElements();
        this.totalPages = page.getTotalPages();
    }
}
