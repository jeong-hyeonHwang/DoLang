package live.dolang.api.chat.controller;

import live.dolang.api.chat.dto.RequestChatQuestionDto;
import live.dolang.api.chat.service.ChatService;
import live.dolang.api.common.response.BaseResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/chat")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;

    @GetMapping("/question")
    public BaseResponse<List<String>> getChatQuestion(@RequestBody RequestChatQuestionDto requestChatQuestionDto) {
        List<String> questionList = chatService.getChatQuestion(requestChatQuestionDto);
        return BaseResponse.ok(questionList);
    }
}
