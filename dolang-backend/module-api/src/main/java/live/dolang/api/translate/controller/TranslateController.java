package live.dolang.api.translate.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import live.dolang.api.common.response.BaseResponse;
import live.dolang.api.translate.service.TranslateService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import live.dolang.api.translate.dto.TranslateRequest;
import live.dolang.api.translate.dto.TranslateResponse;

@Tag(name = "translate")
@RestController
@RequestMapping("/api")
class TranslateController {

    private final TranslateService translateService;

    public TranslateController(TranslateService translateService) {
        this.translateService = translateService;
    }

    @Operation(
            summary = "번역",
            description = "Object로 받은 내용들을 target_lang으로 번역합니다.",
            security = @SecurityRequirement(name = "BearerAuth") // JWT 인증 적용
    )
    @PostMapping("/translate")
    public BaseResponse<TranslateResponse> translate(@RequestBody TranslateRequest request) {
        return BaseResponse.ok(translateService.translate(request));
    }
}