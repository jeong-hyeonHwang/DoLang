package live.dolang.api.post.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BookmarkCountDTO {
    Integer postId;
    Integer bookmarkCount;

}
