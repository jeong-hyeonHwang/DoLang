package live.dolang.api.prompt.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import live.dolang.api.common.response.BaseResponseStatus;
import live.dolang.api.prompt.dto.RequestChatQuestionDto;
import live.dolang.api.prompt.service.PromptService;
import live.dolang.api.common.response.BaseResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Prompt")
@RestController
@RequestMapping("api/prompt")
@RequiredArgsConstructor
public class PromptController {
    private final PromptService promptService;

    /**
     * 관심사 기반 질문 리스트 조회
     */
    @Operation(
            summary = "관심사 기반 질문 리스트 조회",
            description = "매칭된 두 사용자의 관심사를 기반으로 스몰톡 질문 리스트를 조회합니다.",
            security = @SecurityRequirement(name = "BearerAuth") // JWT 인증 적용
    )

    @PostMapping("/question")
    public BaseResponse<List<String>> getChatQuestion(@RequestBody RequestChatQuestionDto requestChatQuestionDto) {
        List<String> questionList = promptService.getChatQuestion(requestChatQuestionDto);
        return BaseResponse.ok(questionList);
    }

    /**
     * 하루 한 문장을 AI에게 추천 받은 후 추가
     */
    @Operation(
            summary = "하루 한 문장을 AI에게 추천받",
            description = "매칭된 두 사용자의 관심사를 기반으로 스몰톡 질문 리스트를 조회합니다.",
            security = @SecurityRequirement(name = "BearerAuth") // JWT 인증 적용
    )
    @GetMapping("/dateSentence")
    public BaseResponse<BaseResponseStatus> getDateSentence() {
        promptService.addDateSentence();
        return BaseResponse.ok();
    }
}
