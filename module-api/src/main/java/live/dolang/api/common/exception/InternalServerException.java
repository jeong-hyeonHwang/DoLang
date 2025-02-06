package live.dolang.api.common.exception;

import live.dolang.api.common.response.BaseResponseStatus;

public class InternalServerException extends BaseException {
    public InternalServerException(BaseResponseStatus status) {
        super(status);
    }
}
