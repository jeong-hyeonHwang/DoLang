package live.dolang.matching.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "사용자 태그 정보")
public class MatchedUserTag {

    @Schema(description = "태그 ID")
    private Integer tagId;

    @Schema(description = "번역된 태그 이름")
    private String translatedName;

}
