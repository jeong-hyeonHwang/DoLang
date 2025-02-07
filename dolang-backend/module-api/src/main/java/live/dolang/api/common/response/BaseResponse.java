package live.dolang.api.common.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Getter;

@Getter
@JsonPropertyOrder({"isSuccess", "code", "message", "result", "totalCount"})
public class BaseResponse<T> {

    private final Boolean isSuccess;
    private final String message;
    private final int code;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private T result;


    public BaseResponse(T result) {
        this.isSuccess = BaseResponseStatus.SUCCESS.isSuccess();
        this.message = BaseResponseStatus.SUCCESS.getMessage();
        this.code = BaseResponseStatus.SUCCESS.getCode();
        this.result = result;
    }

    public BaseResponse(BaseResponseStatus status) {
        this.isSuccess = status.isSuccess();
        this.message = status.getMessage();
        this.code = status.getCode();
    }

    public BaseResponse(BaseResponseStatus status, String message) {
        this.isSuccess = status.isSuccess();
        this.message = message;
        this.code = status.getCode();
    }

    public BaseResponse(Boolean isSuccess, String message, int code, T result) {
        this.isSuccess = isSuccess;
        this.message = message;
        this.code = code;
        this.result = result;
    }
}
