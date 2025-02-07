package live.dolang.api.common.exception;

import live.dolang.api.common.response.BaseResponseStatus;

public class BadRequestException extends BaseException {
    public BadRequestException(BaseResponseStatus status) {
        super(status);
    }
}
