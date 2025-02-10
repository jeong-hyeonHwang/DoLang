package live.dolang.api.tag.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import live.dolang.api.common.response.BaseResponse;
import live.dolang.api.tag.document.TagDocument;
import live.dolang.api.tag.dto.TagRequestDto;
import live.dolang.api.tag.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "USER 태그")
@RestController
@RequestMapping("/api/tag")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    @Operation(hidden = true)
    @PostMapping
    public BaseResponse<Boolean> addTag(@RequestBody TagRequestDto requestDto) {
        return BaseResponse.ok(tagService.addTag(requestDto));
    }

    @Operation(
            summary = "태그 전체 조회",
            security = @SecurityRequirement(name = "BearerAuth")
    )
    @GetMapping("/all")
    public BaseResponse<List<TagDocument>> getAllTags(@RequestParam String nativeLanguageId) {
        return BaseResponse.ok(tagService.allTags(nativeLanguageId));
    }

    // 기록 검색 (Elasticsearch 에서 키워드 검색)
    @Operation(
            summary = "태그 검색 조회",
            security = @SecurityRequirement(name = "BearerAuth")
    )
    @GetMapping("/search")
    public BaseResponse<List<TagDocument>> searchNotes(@RequestParam String name) {
        return BaseResponse.ok(tagService.searchTags(name));
    }
}
