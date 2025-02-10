package live.dolang.api.tag.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TagRequestDto {

    public TagRequestDto() {
    }

    private Integer tagId;
    private String nativeLanguageId;
    private String name;
}
