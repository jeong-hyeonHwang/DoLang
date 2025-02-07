package live.dolang.api.tag.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.*;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(indexName = "tags")  // ES의 인덱스 이름
public class TagDocument {

    @Id
    private String id;  // Elasticsearch에서 사용할 문서 ID

    @Field(type = FieldType.Integer, name = "tag_id")
    private Integer tagId; // 프론트에서 쓸 tagId

    @Field(type = FieldType.Keyword, name = "native_language_id")
    private String nativeLanguageId;  // 모국어 언어 코드 (ex: "en", "ko")

    @Field(type = FieldType.Text, analyzer = "standard", name = "name")
    private String name;  // 태그들
}
