package live.dolang.api.common.exception;

import live.dolang.api.common.response.BaseResponseStatus;

public class InvalidSortTypeException extends BaseException {
    public InvalidSortTypeException(String sort) {
        super(BaseResponseStatus.valueOf("잘못된 정렬 기준입니다: " + sort));
    }
}
