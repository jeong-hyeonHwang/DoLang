export interface MyFeedResponse {
  isSuccess: boolean;
  code: number;
  message: string;
  result: {
    content: MyFeed[];
    pageable: Pageable;
    last: boolean;
    totalElements: number;
    totalPages: number;
    first: boolean;
    size: number;
    number: number;
    sort: Sort;
    numberOfElements: number;
    empty: false;
  };
}

export interface MyFeed {
  feedId: number;
  postId: number;
  date: string;
  voiceUrl: string;
  nativeSentence: string;
  targetSentence: string;
  bookmarkCount?: number;
  heartCount?: number;
  isSelfBookmarked: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}
