package live.dolang.api.post.repository;

import live.dolang.api.post.dto.BookmarkCountDTO;

import java.util.List;

public interface CustomUserSentenceBookmarkLogRepository {
    List<BookmarkCountDTO> findAllPostBookmarkCountsRaw();
}