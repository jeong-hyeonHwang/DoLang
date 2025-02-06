package live.dolang.api.common.exception;

import live.dolang.api.common.response.BaseResponseStatus;

public class UserProfileNotFoundException extends BaseException {
    public UserProfileNotFoundException(BaseResponseStatus status) {
        super(status);
    }
}
