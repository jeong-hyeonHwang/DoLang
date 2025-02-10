package live.dolang.api.tag.repository;

import live.dolang.api.tag.document.TagDocument;
import org.springframework.data.elasticsearch.annotations.SourceFilters;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TagSearchRepository extends ElasticsearchRepository<TagDocument, String>{

    // 언어의 모든 태그 검색
    List<TagDocument> findByNativeLanguageId(String nativeLanguageId);

    /*
        특정 유저의 기록에서 특정 단어나 문장이 포함된 데이터 검색
        현재는 접두를 기준으로 검색 결과 제공.
     */
    List<TagDocument> searchByNameStartingWith(String name);
}