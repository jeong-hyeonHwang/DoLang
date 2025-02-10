package live.dolang.api.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import live.dolang.api.common.response.BaseResponse;
import live.dolang.api.common.response.BaseResponseStatus;
import live.dolang.api.user.dto.RequestRegisterUserProfileDto;
import live.dolang.api.user.dto.RequestUpdateUserInfoDto;
import live.dolang.api.user.dto.ResponseUserInfoDto;
import live.dolang.api.user.dto.ResponseUserTagIdDto;
import live.dolang.api.user.service.CustomUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "USER 정보")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {
    private final CustomUserService userService;

    /**
     * 유저 정보 조회
     */
    @Operation(
            summary = "유저 정보 조회",
            description = "현재 로그인된 사용자의 정보(프로파일)를 조회합니다.",
            security = @SecurityRequirement(name = "BearerAuth") // JWT 인증 적용
    )
    @GetMapping("/")
    public BaseResponse<ResponseUserInfoDto> getUserInfo(@AuthenticationPrincipal Jwt jwt) {
        int userId = Integer.parseInt(jwt.getId());
        return new BaseResponse<>(userService.getUserInfo(userId));
    }

    /**
     * 유저 정보 등록
     */
    @Operation(
            summary = "유저 정보 등록",
            description = "현재 로그인된 사용자의 정보(프로파일)를 등록합니다.",
            security = @SecurityRequirement(name = "BearerAuth") // JWT 인증 적용
    )
    @PostMapping("/")
    public BaseResponse<BaseResponseStatus> registerUserInfo(@AuthenticationPrincipal Jwt jwt,
                                                             @RequestBody RequestRegisterUserProfileDto requestRegisterUserProfileDto) {
        int userId = Integer.parseInt(jwt.getId());
        userService.registerUserInfo(userId, requestRegisterUserProfileDto);
        return new BaseResponse<>(BaseResponseStatus.SUCCESS);
    }

    /**
     * 유저 정보 수정
     */
    @Operation(
            summary = "유저 정보 수정",
            description = "현재 로그인된 사용자의 정보(프로파일)를 수정합니다.",
            security = @SecurityRequirement(name = "BearerAuth") // JWT 인증 적용
    )
    @PutMapping("/")
    public BaseResponse<BaseResponseStatus> updateUserInfo(@AuthenticationPrincipal Jwt jwt,
                                                           @RequestBody RequestUpdateUserInfoDto requestUpdateUserInfoDto) {
        int userId = Integer.parseInt(jwt.getId());
        userService.updateUserInfo(userId, requestUpdateUserInfoDto);
        return new BaseResponse<>(BaseResponseStatus.SUCCESS);
    }

    /**
     * 유저 태그 아이디 조회
     */
    @Operation(
            summary = "유저 관심사 목록 아이디들 조회",
            description = "현재 로그인된 사용자의 관심사 목록 아이디들을 조회 조회합니다.",
            security = @SecurityRequirement(name = "BearerAuth") // JWT 인증 적용
    )
    @GetMapping("/tags")
    public BaseResponse<List<ResponseUserTagIdDto>> getUserTagIds(@AuthenticationPrincipal Jwt jwt) {
        int userId = Integer.parseInt(jwt.getId());
        List<ResponseUserTagIdDto> userTagIdList = userService.getUserTagIds(userId);
        return new BaseResponse<>(userTagIdList);
    }
}


