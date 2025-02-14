package live.dolang.api.call.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import live.dolang.api.call.dto.CallPageRequest;
import live.dolang.api.call.dto.CallPageResponse;
import live.dolang.api.call.service.CallService;
import live.dolang.api.common.response.BaseResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@Tag(name = "통화기록")
@RestController
@RequestMapping("/api/call")
@RequiredArgsConstructor
public class CallController {

    private final CallService callService;

    // TODO
    @PostMapping
    public BaseResponse<?> startCall() {
        return BaseResponse.ok();
    }

    // TODO
    @PutMapping
    public BaseResponse<?> endCall() {
        return BaseResponse.ok();
    }

    @Operation(
            summary = "통화 기록 조회",
            security = @SecurityRequirement(name = "BearerAuth") // JWT 인증 적용
    )
    @GetMapping("/list")
    public BaseResponse<CallPageResponse> getCallPage(
            @AuthenticationPrincipal Jwt jwt,
            @Schema(example = "page=0&size=10&sort=name,asc")
            @Valid CallPageRequest request
    ) {
        Integer userId = Integer.valueOf(jwt.getId());
        return BaseResponse.ok(callService.getCallPage(userId, request));
    }
}
