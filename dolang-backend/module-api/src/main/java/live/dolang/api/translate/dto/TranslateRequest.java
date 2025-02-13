package live.dolang.api.translate.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TranslateRequest {
    private List<String> text;
    private String target_lang;
}