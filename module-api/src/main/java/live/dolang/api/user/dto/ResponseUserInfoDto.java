package live.dolang.api.user.dto;

import lombok.*;

import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResponseUserInfoDto {
    private String profileImageUrl;
    private String nickname;
    private String countryId;
    private String nativeLanguageId;
    private String interestLanguageId;
    private String languageLevelId;
    private List<String> tags;

}


