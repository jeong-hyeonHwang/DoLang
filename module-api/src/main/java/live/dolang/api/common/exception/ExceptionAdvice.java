package live.dolang.api.common.exception;

import live.dolang.api.common.response.BaseResponse;
import live.dolang.api.common.response.BaseResponseStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class ExceptionAdvice {
    @ExceptionHandler(UserProfileNotFoundException.class)
    @ResponseStatus(value = HttpStatus.NOT_FOUND)
    public BaseResponse<BaseResponseStatus> UserProfileNotFoundExceptionHandler(UserProfileNotFoundException exception) {
        log.warn("UserProfileNotFoundException has occurred. %s %s %s".formatted(exception.getMessage(), exception.getCause(), exception.getStackTrace()[0]));
        return new BaseResponse<>(exception.getStatus());
    }

    @ExceptionHandler(UserNotFoundException.class)
    @ResponseStatus(value = HttpStatus.NOT_FOUND)
    public BaseResponse<BaseResponseStatus> UserNotFoundExceptionHandler(UserNotFoundException exception) {
        log.warn("UserNotFoundException has occurred. %s %s %s".formatted(exception.getMessage(), exception.getCause(), exception.getStackTrace()[0]));
        return new BaseResponse<>(exception.getStatus());
    }
}
