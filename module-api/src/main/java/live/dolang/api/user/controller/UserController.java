package live.dolang.api.user.controller;

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
                                                                @RequestBody RequestRegisterUserProfileDto requestRegisterUserProfileDto) {
        int userId = Integer.parseInt(jwt.getId());
        userService.registerUserInfo(userId, requestRegisterUserProfileDto);
        return new BaseResponse<>(BaseResponseStatus.SUCCESS);
    }

    @PutMapping()
    public BaseResponse<BaseResponseStatus> updateUserInfo(@AuthenticationPrincipal Jwt jwt,
                                                           @RequestBody RequestUpdateUserInfoDto requestUpdateUserInfoDto) {
        int userId = Integer.parseInt(jwt.getId());
        userService.updateUserInfo(userId, requestUpdateUserInfoDto);
        return new BaseResponse<>(BaseResponseStatus.SUCCESS);
    }

    @GetMapping("/tags")
    public BaseResponse<ResponseUserTagIdDto> getUserTags(@AuthenticationPrincipal Jwt jwt) {
        int userId = Integer.parseInt(jwt.getId());
        List<ResponseUserTagIdDto> userTagIdList = userService.getUserTagIds(userId);
        return new BaseResponse(userTagIdList);
    }
}
