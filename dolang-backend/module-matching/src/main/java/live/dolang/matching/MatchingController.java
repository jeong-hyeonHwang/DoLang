package live.dolang.matching;

import live.dolang.matching.reqeust.MatchingStartRequest;
import live.dolang.matching.reqeust.MatchingStopRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
@RequiredArgsConstructor
public class MatchingController {

    private final MatchingService matchingService;

    // StompHeaderAccessor accessor

    @MessageMapping("start")
    public void matchStart(@Payload MatchingStartRequest request, JwtAuthenticationToken principal) {
        matchingService.enrollUser(request, principal);
    }

    @MessageMapping("stop")
    public void matchEnd(@Payload MatchingStopRequest request, JwtAuthenticationToken principal) {
        matchingService.dropOutUser(request, principal);
    }

    @MessageExceptionHandler
    public void handleException(Exception exception) {
        log.error(exception.getMessage(), exception);
    }

}