package live.dolang.api.user.dto;

import lombok.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Builder
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ResponseUserInfoDto {
    private String profileImageUrl;
    private String nickname;
    private String countryId;
    private String nativeLanguageId;
    private String interestLanguageId;
    private String languageLevelId;
    private List<TagDto> tags;

    public void updateTags(List<TagDto> tags) {
        this.tags = tags;
    }
}


