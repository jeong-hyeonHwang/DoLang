package live.dolang.api.common.exception;

import live.dolang.api.common.response.BaseResponseStatus;

public class UnauthorizedException extends BaseException {
    public UnauthorizedException(BaseResponseStatus status) {
        super(status);
    }
}


