package live.dolang.api.tag.service;


import live.dolang.api.tag.document.TagDocument;
import live.dolang.api.tag.repository.TagSearchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TagService {

    private final TagSearchRepository tagSearchRepository;

    // Elasticsearch에서 키워드 검색
    public List<TagDocument> searchTags(String name) {
        return tagSearchRepository.searchByNameStartingWith(name);
    }

    public List<TagDocument> allTags(String nativeLanguageId) {
        return tagSearchRepository.findByNativeLanguageId(nativeLanguageId);
    }
}