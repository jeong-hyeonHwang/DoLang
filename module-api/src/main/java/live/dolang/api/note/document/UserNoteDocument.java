package live.dolang.api.note.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.*;

import java.time.Instant;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(indexName = "user_notes")  // ES의 인덱스 이름
public class UserNoteDocument {

    @Id
    private String id;  // Elasticsearch에서 사용할 문서 ID

    @Field(type = FieldType.Integer, name = "user_id")
    private Integer userId;  // 특정 유저의 데이터만 필터링하기 위한 필드

    @Field(type = FieldType.Text, analyzer = "standard", name = "native_note")
    private String nativeNote;  // 사용자가 입력한 모국어 문장

    @Field(type = FieldType.Text, analyzer = "standard", name = "interest_note")
    private String interestNote;  // 사용자가 관심 있는 언어의 문장

    @Field(type = FieldType.Keyword, name = "native_language_id")
    private String nativeLanguageId;  // 모국어 언어 코드 (ex: "en", "ko")

    @Field(type = FieldType.Keyword, name = "interest_language_id")
    private String interestLanguageId;  // 관심 언어 코드 (ex: "fr", "es")

    @Field(type = FieldType.Date, name = "created_at")
    private Instant createdAt;  // 생성 날짜 (ES에서 날짜 필드로 저장)

}
