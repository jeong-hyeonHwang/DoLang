package live.dolang.api.prompt.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Builder
public class RequestChatQuestionDto {
    private List<String> interestA;
    private List<String> interestB;
}
