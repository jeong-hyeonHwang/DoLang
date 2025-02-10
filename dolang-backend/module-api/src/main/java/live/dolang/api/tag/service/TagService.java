package live.dolang.api.tag.service;


import live.dolang.api.tag.document.TagDocument;
import live.dolang.api.tag.dto.TagRequestDto;
import live.dolang.api.tag.repository.TagSearchRepository;
import live.dolang.core.domain.tag.Tag;
import live.dolang.core.domain.tag.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TagService {

    private final TagSearchRepository tagSearchRepository;
    private final TagRepository tagRepository;

    @Transactional
    public boolean addTag(TagRequestDto requestDto) {

        // try-catch 로 데이터 무결성 검증
        try {
            // MySQL 저장
            Integer tagId = requestDto.getTagId();
            if (!tagRepository.existsById(tagId)) {
            Tag tag = Tag.builder()
                    .id(tagId)
                    .name(requestDto.getName())
                    .build();
            tagRepository.save(tag);
            }
            // Elasticsearch 에 저장 (UserNoteDocument 변환)
            TagDocument tagDocument = TagDocument.builder()
                    .tagId(tagId)
                    .nativeLanguageId(requestDto.getNativeLanguageId())
                    .name(requestDto.getName())
                    .build();
            tagSearchRepository.save(tagDocument);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public List<TagDocument> allTags(String nativeLanguageId) {
        return tagSearchRepository.findByNativeLanguageId(nativeLanguageId);
    }

    // Elasticsearch 에서 키워드 검색
    public List<TagDocument> searchTags(String name) {
        return tagSearchRepository.searchByNameStartingWith(name);
    }

}