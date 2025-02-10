package live.dolang.api.common.exception;

import live.dolang.api.common.response.BaseResponseStatus;

public class DuplicateException extends BaseException {
    public DuplicateException(BaseResponseStatus status) {
        super(status);
    }
}
