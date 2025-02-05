export type BookmarkCountDto = {
  postId: number;
  bookmarkCount: number;
};

export type BookmarkDataDto = {
  isBookmarked: boolean;
  timestamp: number;
};

export type BookmarkStatusDto = {
  isBookmarked: boolean;
};
