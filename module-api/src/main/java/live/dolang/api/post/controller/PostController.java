package live.dolang.api.post.controller;

import live.dolang.api.post.service.UserDateSentenceService;
import live.dolang.api.post.service.facade.BookmarkFacadeService;
import live.dolang.core.exception.CustomException;
import live.dolang.core.exception.ErrorCode;
import live.dolang.core.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/post")
@RequiredArgsConstructor
public class PostController {

    private final UserService userService;
    private final UserDateSentenceService userDateSentenceService;
    private final BookmarkFacadeService bookmarkFacadeService;

    // 북마크 추가
    @PostMapping("/{userDateSentenceId}/bookmark")
    public ResponseEntity<?> bookmarkPost(@AuthenticationPrincipal Jwt jwt, @PathVariable Integer userDateSentenceId) {
        Integer userId = Integer.parseInt(jwt.getId());
        if (!userService.isUserExists(userId)) {
            throw new CustomException(ErrorCode.USER_NOT_FOUND);
        }

        if (userDateSentenceService.isUserDateSentenceExists(userDateSentenceId)) {
            throw new CustomException(ErrorCode.RECORD_NOT_FOUND);
        }

        bookmarkFacadeService.bookmarkUserDateSentence(userId, userDateSentenceId);
        return ResponseEntity.ok(null);
    }

    // 북마크 취소
    @DeleteMapping("/{userDateSentenceId}/bookmark")
    public ResponseEntity<?> unbookmarkPost(@AuthenticationPrincipal Jwt jwt, @PathVariable Integer userDateSentenceId) {
        Integer userId = Integer.parseInt(jwt.getId());
        if (userService.isUserExists(userId)) {
            throw new CustomException(ErrorCode.USER_NOT_FOUND);
        }

        if (userDateSentenceService.isUserDateSentenceExists(userDateSentenceId)) {
            throw new CustomException(ErrorCode.RECORD_NOT_FOUND);
        }

        bookmarkFacadeService.unbookmarkUserDateSentence(userId, userDateSentenceId);
        return ResponseEntity.ok(null);
    }
}
