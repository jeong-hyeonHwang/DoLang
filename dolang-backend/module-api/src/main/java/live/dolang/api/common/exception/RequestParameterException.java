package live.dolang.api.common.exception;

import live.dolang.api.common.response.BaseResponseStatus;

public class RequestParameterException extends BaseException {
    public RequestParameterException(BaseResponseStatus status) {
        super(status);
    }
}

