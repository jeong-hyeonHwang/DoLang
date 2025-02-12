package live.dolang.api.tag.dto;

import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

@Getter
@Setter
@NoArgsConstructor
public class TagSearchDto {

    @Pattern(regexp = "en|kr", message = "언어는 'en' 또는 'kr' 만 허용됩니다.")
    private String nativeLanguageId;

    @Length(max = 50, message = "검색어는 50자 미만만 허용됩니다.")
    private String name;
}
