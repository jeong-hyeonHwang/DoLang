package live.dolang.api.post.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookmarkDataDto {
    private boolean isBookmarked;
    private long timestamp;
}
