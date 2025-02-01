package live.dolang.api.post.controller;

import live.dolang.api.post.service.facade.BookmarkFacadeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private BookmarkFacadeService bookmarkFacadeService;

    // 북마크 추가
    @PostMapping("/{postId}/bookmark")
    public ResponseEntity<?> bookmarkPost(@PathVariable String postId, @RequestBody Map<String, String> request) {
        String userId = request.get("userId");
        bookmarkFacadeService.bookmarkPost(userId, postId);
        Integer bookmarkCount = bookmarkFacadeService.getPostBookmarkCount(postId);
        return ResponseEntity.ok(Map.of("message", "Post bookmarked successfully.", "bookmarkCount", bookmarkCount));
    }

    // 북마크 취소
    @DeleteMapping("/{postId}/bookmark")
    public ResponseEntity<?> unbookmarkPost(@PathVariable String postId, @RequestBody Map<String, String> request) {
        String userId = request.get("userId");
        bookmarkFacadeService.unbookmarkPost(userId, postId);
        Integer bookmarkCount = bookmarkFacadeService.getPostBookmarkCount(postId);
        return ResponseEntity.ok(Map.of("message", "Post unbookmarked successfully.", "bookmarkCount", bookmarkCount));
    }
}
