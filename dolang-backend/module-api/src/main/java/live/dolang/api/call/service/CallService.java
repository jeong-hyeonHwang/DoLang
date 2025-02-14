package live.dolang.api.call.service;

import jakarta.validation.Valid;
import live.dolang.api.call.dto.CallPageRequest;
import live.dolang.api.call.dto.CallPageResponse;
import org.springframework.stereotype.Service;

@Service
public class CallService {

    /**
     * 통화 페이징 요청 결과를 반환합니다.
     *
     * @param userId  사용자 ID
     * @param request {@code CallPageRequest} 통화 페이징 요청 객체
     * @return {@code CallPageResponse}
     */
    public CallPageResponse getCallPage(Integer userId, @Valid CallPageRequest request) {
        return new CallPageResponse();
    }
}
