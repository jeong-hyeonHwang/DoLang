package live.dolang.api.user.controller;

import live.dolang.api.common.response.BaseResponse;
import live.dolang.api.common.response.BaseResponseStatus;
import live.dolang.api.user.dto.RequestUserProfileDto;
import live.dolang.api.user.dto.ResponseUserInfoDto;
import live.dolang.api.user.service.CustomUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {
    private final CustomUserService userService;
    @GetMapping()
    public BaseResponse<ResponseUserInfoDto> getUserInfo(@AuthenticationPrincipal Jwt jwt) {
        int userId = Integer.parseInt(jwt.getId());
        return new BaseResponse<>(userService.getUserInfo(userId));
    }

    @PostMapping()
    public BaseResponse<BaseResponseStatus> registerUserInfo(@AuthenticationPrincipal Jwt jwt,
                                                                @RequestBody RequestUserProfileDto requestUserProfileDto) {
        int userId = Integer.parseInt(jwt.getId());
        userService.registerUserInfo(userId, requestUserProfileDto);
        return new BaseResponse<>(BaseResponseStatus.SUCCESS);
    }

}
