package live.dolang.api.user.dto;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TagDto {
    private Integer tagId;
    private String tagName;
}
