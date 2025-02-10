package live.dolang.api.note.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserNoteRequestDto {
    private String nativeNote;
    private String interestNote;
    private String nativeLanguageId;
    private String interestLanguageId;
}
