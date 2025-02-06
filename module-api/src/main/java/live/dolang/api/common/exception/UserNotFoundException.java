package live.dolang.api.common.exception;

import live.dolang.api.common.response.BaseResponseStatus;

public class UserNotFoundException extends BaseException{
    public UserNotFoundException(BaseResponseStatus status) {
        super(status);
    }
}
