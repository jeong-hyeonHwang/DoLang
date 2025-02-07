package live.dolang.core.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ControllerAdvice;

import java.util.Map;
@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<Map<String, Object>> handleCustomException(CustomException ex) {
        return ResponseEntity
                .status(ex.getErrorCode().getStatus())
                .body(Map.of(
                        "error", ex.getErrorCode().name(),
                        "message", ex.getMessage()
                ));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
        log.error("Unexpected error occurred: ", ex);  // 에러 로그 출력
        return ResponseEntity
                .status(ErrorCode.DATABASE_ERROR.getStatus())
                .body(Map.of(
                        "error", "INTERNAL_SERVER_ERROR",
                        "message", "An unexpected error occurred"
                ));
    }
}

