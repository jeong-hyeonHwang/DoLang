package live.dolang.api.common.exception;

import live.dolang.api.common.response.BaseResponseStatus;

public class NotFoundException extends BaseException {
    public NotFoundException(BaseResponseStatus status) {
        super(status);
    }
}

