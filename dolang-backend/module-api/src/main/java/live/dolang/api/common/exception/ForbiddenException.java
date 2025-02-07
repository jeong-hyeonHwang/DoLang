package live.dolang.api.common.exception;

import live.dolang.api.common.response.BaseResponseStatus;

public class ForbiddenException extends BaseException {
    public ForbiddenException(BaseResponseStatus status) {
        super(status);
    }
}

