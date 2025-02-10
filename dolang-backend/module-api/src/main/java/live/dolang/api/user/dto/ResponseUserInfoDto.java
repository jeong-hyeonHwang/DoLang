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
    private String nationality;
    private String nativeLanguage;
    private String targetLanguage;
    private String proficiencyLevel;
    private List<TagDto> interests;

    public void updateTags(List<TagDto> interests) {
        this.interests = interests;
    }
}


