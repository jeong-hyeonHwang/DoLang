package live.dolang.api.note.controller;

import live.dolang.api.note.document.UserNoteDocument;
import live.dolang.api.note.dto.UserNoteRequestDto;
import live.dolang.api.note.service.UserNoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/note")
@RequiredArgsConstructor
public class UserNoteController {

    private final UserNoteService userNoteService;

    // 문장 또는 단어 추가 (MySQL & Elasticsearch 저장)
    @PostMapping
    public ResponseEntity<Boolean> createUserNote(@RequestBody UserNoteRequestDto requestDto) {
        boolean success = userNoteService.saveUserNote(requestDto);
        if (success) {
            return ResponseEntity.ok(true); // 저장 성공
        } else {
            return ResponseEntity.status(500).body(false); // 저장 실패
        }
    }

    // 기록 조회 (Elasticsearch에서 ID로 조회, 실패 시 MySQL)
    @GetMapping("/{userId}")
    public ResponseEntity<List<UserNoteDocument>> getUserNotes(@PathVariable Integer userId) {
        return ResponseEntity.ok(userNoteService.getUserNoteById(userId));
    }

    // 기록 검색 (Elasticsearch에서 키워드 검색)
    @GetMapping("/{userId}/search")
    public ResponseEntity<List<UserNoteDocument>> searchNotes(@PathVariable Integer userId, @RequestParam String keyword) {
        return ResponseEntity.ok(userNoteService.searchUserNotes(userId, keyword));
    }
}
