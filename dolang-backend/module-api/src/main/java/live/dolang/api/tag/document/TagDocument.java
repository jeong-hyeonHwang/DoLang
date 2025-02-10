package live.dolang.api.tag.document;

import io.swagger.v3.oas.annotations.media.Schema;
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
    @Schema(description = "Elasticsearch 에서 사용할 문서 ID")
    private String id;  // Elasticsearch 에서 사용할 문서 ID

    @Schema(description = "프론트에서 쓸 Tag ID")
    @Field(type = FieldType.Integer, name = "tag_id")
    private Integer tagId; // 프론트에서 쓸 tagId

    @Schema(description = "모국어 언어 코드", example = "en")
    @Field(type = FieldType.Keyword, name = "native_language_id")
    private String nativeLanguageId;  // 모국어 언어 코드 (ex: "en", "ko")

    @Schema(description = "태그들")
    @Field(type = FieldType.Text, analyzer = "standard", name = "name")
    private String name;  // 태그들
}
