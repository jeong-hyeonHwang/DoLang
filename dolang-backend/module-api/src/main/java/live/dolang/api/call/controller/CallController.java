package live.dolang.api.call.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import live.dolang.api.call.dto.*;
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

    @Operation(
            summary = "통화 시작",
            description = "매칭 결과의 owner 를 기반으로 둘 중 한명만 호출해야 합니다.",
            security = @SecurityRequirement(name = "BearerAuth") // JWT 인증 적용
    )
    @PostMapping("/start")
    public BaseResponse<StartCallResponse> startCall(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody StartCallRequest request
    ) {
        Integer userId = Integer.valueOf(jwt.getId());
        return BaseResponse.ok(callService.startCall(userId, request));
    }

    @Operation(
            summary = "통화 종료",
            description = "통화 시작의 응답 결과로 반환된 callId 를 파라미터로 받습니다. 즉 통화 시작을 호출한 사람이 통화 종료도 호출해야 합니다."
    )
    @PostMapping("/end")
    public BaseResponse<?> endCall(
            @Valid @RequestBody StopCallRequest request
    ) {
        callService.endCall(request);
        return BaseResponse.ok();
    }

    @Operation(
            summary = "통화 기록 조회",
            security = @SecurityRequirement(name = "BearerAuth") // JWT 인증 적용
    )
    @GetMapping("/list")
    public BaseResponse<CallPageResponse> getCallPage(
            @AuthenticationPrincipal Jwt jwt,
            @Valid CallPageRequest request
    ) {
        Integer userId = Integer.valueOf(jwt.getId());
        return BaseResponse.ok(callService.getCallPage(userId, request));
    }
}
