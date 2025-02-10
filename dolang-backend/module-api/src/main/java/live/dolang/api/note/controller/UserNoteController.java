package live.dolang.api.note.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import live.dolang.api.common.response.BaseResponse;
import live.dolang.api.note.document.UserNoteDocument;
import live.dolang.api.note.dto.UserNoteRequestDto;
import live.dolang.api.note.service.UserNoteService;
import lombok.RequiredArgsConstructor;
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
    public BaseResponse<?> createUserNote(@AuthenticationPrincipal Jwt jwt, @RequestBody UserNoteRequestDto requestDto) {
        int userId = Integer.parseInt(jwt.getId());
        userNoteService.saveUserNote(userId, requestDto);
        return BaseResponse.ok(); // 저장 성공
    }

    // 기록 조회 (Elasticsearch 에서 ID로 조회, 실패 시 MySQL)
    @Operation(
            summary = "문장 또는 단어 전체 조회",
            description = "현재 로그인된 사용자의 문장 또는 단어를 전부 조회합니다.",
            security = @SecurityRequirement(name = "BearerAuth") // JWT 인증 적용
    )
    @GetMapping
    public BaseResponse<List<UserNoteDocument>> getUserNotes(@AuthenticationPrincipal Jwt jwt) {
        int userId = Integer.parseInt(jwt.getId());
        return BaseResponse.ok(userNoteService.getUserNoteById(userId));
    }

    // 기록 검색 (Elasticsearch 에서 키워드 검색)
    @Operation(
            summary = "문장 또는 단어 검색 조회",
            description = "현재 로그인된 사용자의 문장 또는 단어를 검색합니다.",
            security = @SecurityRequirement(name = "BearerAuth") // JWT 인증 적용
    )
    @GetMapping("/search")
    public BaseResponse<List<UserNoteDocument>> searchNotes(@AuthenticationPrincipal Jwt jwt, @RequestParam String keyword) {
        int userId = Integer.parseInt(jwt.getId());
        return BaseResponse.ok(userNoteService.searchUserNotes(userId, keyword));
    }
}
