package live.dolang.api.common.exception;

import live.dolang.api.common.response.BaseResponseStatus;

public class ExampleException extends BaseException {
    public ExampleException(BaseResponseStatus status) {
        super(status);
    }
}
