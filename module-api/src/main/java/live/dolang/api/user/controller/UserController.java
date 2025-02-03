package live.dolang.api.user.controller;

import live.dolang.api.user.dto.ResponseUserInfoDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @GetMapping()
    public ResponseEntity getUserInfo(@AuthenticationPrincipal Jwt jwt) {
        String googleId = jwt.getId();



        return new ResponseEntity(HttpStatus.OK);
    }

}
