package live.dolang.api.tag.controller;

import live.dolang.api.tag.document.TagDocument;
import live.dolang.api.tag.dto.TagRequestDto;
import live.dolang.api.tag.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tag")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    @PostMapping
    public ResponseEntity<Boolean> addTag(@RequestBody TagRequestDto requestDto) {
        return ResponseEntity.ok(tagService.addTag(requestDto));
    }

    @GetMapping("/all")
    public ResponseEntity<List<TagDocument>> getAllTags(@RequestParam String nativeLanguageId) {
        return ResponseEntity.ok(tagService.allTags(nativeLanguageId));
    }

    // 기록 검색 (Elasticsearch에서 키워드 검색)
    @GetMapping("/search")
    public ResponseEntity<List<TagDocument>> searchNotes(@RequestParam String name) {
        return ResponseEntity.ok(tagService.searchTags(name));
    }
}
