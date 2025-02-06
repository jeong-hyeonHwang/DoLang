package live.dolang.api.user.controller;

import live.dolang.api.user.dto.ResponseUserInfoDto;
import live.dolang.api.user.service.CustomUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {
    private final CustomUserService userService;
    @GetMapping()
    public ResponseUserInfoDto getUserInfo(@AuthenticationPrincipal Jwt jwt) {
        int userId = Integer.parseInt(jwt.getId());
        return userService.getUserInfo(userId);
    }

}
