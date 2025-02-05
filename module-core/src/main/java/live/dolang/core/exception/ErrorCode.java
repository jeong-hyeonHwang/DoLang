package live.dolang.core.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."),
    RECORD_NOT_FOUND(HttpStatus.NOT_FOUND, "기록을 찾을 수 없습니다."),
    INVALID_USER_ID(HttpStatus.BAD_REQUEST, "유효하지 않은 사용자입니다."),
    INVALID_POST_ID(HttpStatus.BAD_REQUEST, "유효하지 않은 기록입니다."),
    DATABASE_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "데이터베이스에 에러가 발생했습니다"),
    UNAUTHORIZED_ACCESS(HttpStatus.UNAUTHORIZED, "허용되지 않은 접근입니다.");

    private final HttpStatus status;
    private final String message;
}