package live.dolang.api.note.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import live.dolang.api.note.document.UserNoteDocument;
import live.dolang.api.note.dto.UserNoteRequestDto;
import live.dolang.api.note.service.UserNoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "USER 단어장")
@RestController
@RequestMapping("/api/note")
@RequiredArgsConstructor
public class UserNoteController {

    private final UserNoteService userNoteService;

    // 문장 또는 단어 추가 (MySQL & Elasticsearch 저장)
    @Operation(
            summary = "문장 또는 단어 추가",
            description = "현재 로그인된 사용자의 문장 또는 단어를 등록합니다.",
            security = @SecurityRequirement(name = "BearerAuth") // JWT 인증 적용
    )
    @PostMapping
    public ResponseEntity<Boolean> createUserNote(@AuthenticationPrincipal Jwt jwt, @RequestBody UserNoteRequestDto requestDto) {
        int userId = Integer.parseInt(jwt.getId());
        boolean success = userNoteService.saveUserNote(userId, requestDto);
        if (success) {
            return ResponseEntity.ok(true); // 저장 성공
        } else {
            return ResponseEntity.status(500).body(false); // 저장 실패
        }
    }

    // 기록 조회 (Elasticsearch 에서 ID로 조회, 실패 시 MySQL)
    @Operation(
            summary = "문장 또는 단어 전체 조회",
            description = "현재 로그인된 사용자의 문장 또는 단어를 전부 조회합니다.",
            security = @SecurityRequirement(name = "BearerAuth") // JWT 인증 적용
    )
    @GetMapping
    public ResponseEntity<List<UserNoteDocument>> getUserNotes(@AuthenticationPrincipal Jwt jwt) {
        int userId = Integer.parseInt(jwt.getId());
        return ResponseEntity.ok(userNoteService.getUserNoteById(userId));
    }

    // 기록 검색 (Elasticsearch 에서 키워드 검색)
    @Operation(
            summary = "문장 또는 단어 검색 조회",
            description = "현재 로그인된 사용자의 문장 또는 단어를 검색합니다.",
            security = @SecurityRequirement(name = "BearerAuth") // JWT 인증 적용
    )
    @GetMapping("/search")
    public ResponseEntity<List<UserNoteDocument>> searchNotes(@AuthenticationPrincipal Jwt jwt, @RequestParam String keyword) {
        int userId = Integer.parseInt(jwt.getId());
        return ResponseEntity.ok(userNoteService.searchUserNotes(userId, keyword));
    }
}
