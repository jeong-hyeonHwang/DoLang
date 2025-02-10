package live.dolang.api.common.response;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum BaseResponseStatus {
    SUCCESS(true, HttpStatus.OK.value(), "요청에 성공하였습니다."),
    INTERNAL_SERVER_ERROR(false, HttpStatus.INTERNAL_SERVER_ERROR.value(), "서버 에러"),
    NOT_FOUND(false, HttpStatus.NOT_FOUND.value(), "존재하지 않는 페이지입니다."),
    BODY_PARSE_ERROR(false, HttpStatus.BAD_REQUEST.value(), "본문 데이터를 읽는데 실패하였습니다. 본문을 올바르게 작성했는지 확인해주세요."),
    INVALID_PARAMETER(false, HttpStatus.BAD_REQUEST.value(), "잘못된 파라미터가 전달되었습니다."),
    INPUT_PARSE_ERROR(false, HttpStatus.BAD_REQUEST.value(), "입력된 데이터가 잘못되었습니다. 입력값을 확인해주세요."),
    RESPONSE_ERROR(false, HttpStatus.NOT_FOUND.value(), "값을 불러오는데 실패하였습니다."),
    EMPTY_JWT(false, HttpStatus.UNAUTHORIZED.value(), "JWT 를 입력해주세요."),
    NOT_AUTHORIZED(false, HttpStatus.UNAUTHORIZED.value(), "로그인이 필요합니다."),
    INVALID_JWT(false, HttpStatus.UNAUTHORIZED.value(), "유효하지 않은 JWT 입니다."),
    EXPIRED_JWT(false, HttpStatus.UNAUTHORIZED.value(), "만료된 JWT 입니다."),
    INVALID_USER_JWT(false, HttpStatus.FORBIDDEN.value(), "권한이 없는 유저의 접근입니다."),
    FAILED_TO_VALIDATION(false, HttpStatus.BAD_REQUEST.value(), "값 검증에 실패하였습니다."),
    ALREADY_EXIST_EMAIL(false, HttpStatus.BAD_REQUEST.value(), "이미 존재하는 이메일입니다."),
    NOT_EXIST_EMAIL(false, HttpStatus.BAD_REQUEST.value(), "존재하지 않는 이메일입니다."),
    NOT_CORRECT_PASSWORD(false, HttpStatus.BAD_REQUEST.value(), "일치하지 않는 비밀번호입니다."),

    WITHDRAW_USER(false, HttpStatus.BAD_REQUEST.value(), "탈퇴한 사용자입니다."),

    /**
     * 유저 에러
     * 자유롭게 작성
     */
    NOT_EXIST_USER_PROFILE(false, 4004, "저장된 유저정보를 찾을 수 없습니다."),
    NOT_EXIST_USER(false, HttpStatus.NOT_FOUND.value(), "존재하지 않는 사용자입니다."),
    NOT_EXIST_FEED(false, HttpStatus.NOT_FOUND.value(), "존재하지 않는 피드입니다."),
    NOT_EXIST_POST(false, HttpStatus.NOT_FOUND.value(), "존재하지 않는 기록입니다."),
    ;


    private final boolean isSuccess;
    private final int code;
    private final String message;

    BaseResponseStatus(boolean isSuccess, int code, String message) {
        this.isSuccess = isSuccess;
        this.code = code;
        this.message = message;
    }

}
