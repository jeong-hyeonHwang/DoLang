package live.dolang.api.tag.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class TagRequestDto {
    private Integer tagId;
    private String nativeLanguageId;
    private String name;
}
