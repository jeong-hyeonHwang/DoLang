package live.dolang.api.tag.repository;

import live.dolang.api.tag.document.TagDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ElasticSearchTagRepository extends ElasticsearchRepository<TagDocument, String> {


    /**
     * 언어의 모든 태그 검색
     * @param nativeLanguageId 특정 언어
     * @return 조회된 언어의 모든 목록
     */
    List<TagDocument> findByNativeLanguageId(String nativeLanguageId);

    /**
     * 특정 언어로 번역된 태그를 검색
     *
     * @param nativeLanguageId 특정 언어
     * @param name             검색어
     * @return 검색된 목록
     */
    List<TagDocument> searchByNativeLanguageIdAndNameStartsWith(String nativeLanguageId, String name);


}