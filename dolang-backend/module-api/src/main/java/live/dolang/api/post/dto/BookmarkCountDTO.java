package live.dolang.api.post.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class BookmarkCountDTO {
    Integer feedId;
    Integer postId;
    Integer bookmarkCount;
}
