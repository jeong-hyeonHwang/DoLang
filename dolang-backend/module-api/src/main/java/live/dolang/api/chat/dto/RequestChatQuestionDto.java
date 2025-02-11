package live.dolang.api.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class RequestChatQuestionDto {
    private List<String> interestA;
    private List<String> interestB;
}
