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
    public void addTag(TagRequestDto requestDto) {

        String nativeLanguageId = requestDto.getNativeLanguageId();
        String name = requestDto.getName();

        // MySQL 저장
        if (!tagRepository.existsByNameAndNativeLanguageId(name, nativeLanguageId)) {
            Tag tag = Tag.builder()
                    .name(name)
                    .nativeLanguageId(nativeLanguageId)
                    .build();
            tagRepository.save(tag);
        }

        // ES 저장
        if (!tagSearchRepository.existsByNameAndNativeLanguageId(name, nativeLanguageId)) {
            TagDocument tagDocument = TagDocument.builder()
                    .nativeLanguageId(nativeLanguageId)
                    .name(name)
                    .build();
            tagSearchRepository.save(tagDocument);
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