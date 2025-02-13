package live.dolang.api.translate.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TranslateResponse {
    private List<Translation> translations;
}