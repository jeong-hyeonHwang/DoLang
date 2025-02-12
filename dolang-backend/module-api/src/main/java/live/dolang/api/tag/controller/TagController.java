package live.dolang.api.tag.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import live.dolang.api.common.response.BaseResponse;
import live.dolang.api.tag.document.TagDocument;
import live.dolang.api.tag.dto.TagSearchDto;
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

    @Operation(hidden = true, summary = "태그의 MySQL 기준으로 ElasticSearch 과의 정합성 보장")
    @PostMapping
    public BaseResponse<?> alignTagIntegrity() {
        tagService.alignTagIntegrity();
        return BaseResponse.ok();
    }

    @Operation(
            summary = "태그 전체 조회",
            security = @SecurityRequirement(name = "BearerAuth")
    )
    @GetMapping("/all")
    public BaseResponse<List<TagDocument>> getAllTags(@RequestParam String nativeLanguageId) {
        return BaseResponse.ok(tagService.allTags(nativeLanguageId));
    }


    @Operation(
            summary = "태그 검색 조회",
            security = @SecurityRequirement(name = "BearerAuth")
    )
    @GetMapping("/search")
    public BaseResponse<List<TagDocument>> searchNotes(@ModelAttribute @Valid TagSearchDto requestDto) {
        return BaseResponse.ok(tagService.searchTags(requestDto));
    }
}
