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

    @ExceptionHandler(BadRequestException.class)
    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    public BaseResponse<BaseResponseStatus> BadRequestExceptionExceptionHandler(BadRequestException exception) {
        log.warn("BadRequestException has occurred. %s %s %s".formatted(exception.getMessage(), exception.getCause(), exception.getStackTrace()[0]));
        return new BaseResponse<>(exception.getStatus());
    }

    @ExceptionHandler(UnauthorizedException.class)
    @ResponseStatus(value = HttpStatus.UNAUTHORIZED)
    public BaseResponse<BaseResponseStatus> UnauthorizedExceptionHandler(UnauthorizedException exception) {
        log.warn("UnauthorizedException has occurred. %s %s %s".formatted(exception.getMessage(), exception.getCause(), exception.getStackTrace()[0]));
        return new BaseResponse<>(exception.getStatus());
    }

    @ExceptionHandler(ForbiddenException.class)
    @ResponseStatus(value = HttpStatus.FORBIDDEN)
    public BaseResponse<BaseResponseStatus> ForbiddenExceptionHandler(ForbiddenException exception) {
        log.warn("ForbiddenException has occurred. %s %s %s".formatted(exception.getMessage(), exception.getCause(), exception.getStackTrace()[0]));
        return new BaseResponse<>(exception.getStatus());
    }

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

    @ExceptionHandler(ForbiddenException.class)
    @ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
    public BaseResponse<BaseResponseStatus> InternalServerExceptionHandler(InternalServerException exception) {
        log.warn("InternalServerException has occurred. %s %s %s".formatted(exception.getMessage(), exception.getCause(), exception.getStackTrace()[0]));
        return new BaseResponse<>(exception.getStatus());
    }
}
