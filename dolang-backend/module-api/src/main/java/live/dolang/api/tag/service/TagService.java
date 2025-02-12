package live.dolang.api.tag.service;


import live.dolang.api.tag.document.TagDocument;
import live.dolang.api.tag.dto.TagSearchDto;
import live.dolang.api.tag.repository.ElasticSearchTagRepository;
import live.dolang.core.domain.language_level.tag_translation.TagTranslation;
import live.dolang.core.domain.language_level.tag_translation.repository.TagTranslationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TagService {

    private final ElasticSearchTagRepository elasticSearchTagRepository;
    private final TagTranslationRepository tagTranslationRepository;

    /**
     * (데이터용) MySQL 를 기준으로 ES 와의 데이터 정합성을 보장한다. (성능 개선 필요)
     */
    public void alignTagIntegrity() {
        // Mysql 에서 TagTranslation 을 조회한다.
        List<TagTranslation> tagTranslationList = tagTranslationRepository.findAll();
        List<TagDocument> tagDocumentList = tagTranslationList.stream()
                .map(it -> TagDocument.builder()
                        .tagId(it.getTag().getId())
                        .nativeLanguageId(it.getNativeLanguageId())
                        .name(it.getTranslatedName())
                        .build()).toList();

        // ElasticSearch 에서 삭제한다.
        elasticSearchTagRepository.deleteAll();
        if (!tagDocumentList.isEmpty()) {
            elasticSearchTagRepository.saveAll(tagDocumentList);
        }
    }

    /**
     * ElasticSearch 에서 특정언어로 번역된 모든 태그 조회
     *
     * @param nativeLanguageId 특정 언어
     * @return 모든 태그 리스트
     */
    public List<TagDocument> allTags(String nativeLanguageId) {
        return elasticSearchTagRepository.findByNativeLanguageId(nativeLanguageId);
    }


    /**
     * ElasticSearch 에서 키워드 검색
     *
     * @param name TagRequestDto
     * @return 검색 결과
     */
    public List<TagDocument> searchTags(TagSearchDto name) {
        return elasticSearchTagRepository.searchByNativeLanguageIdAndNameStartsWith(name.getNativeLanguageId(), name.getName());
    }

}