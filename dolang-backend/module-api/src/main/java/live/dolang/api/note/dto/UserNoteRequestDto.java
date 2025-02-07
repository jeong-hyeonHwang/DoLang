package live.dolang.api.note.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserNoteRequestDto {

    public UserNoteRequestDto() {
    }

    private Integer userId;
    private String nativeNote;
    private String interestNote;
    private String nativeLanguageId;
    private String interestLanguageId;
}
