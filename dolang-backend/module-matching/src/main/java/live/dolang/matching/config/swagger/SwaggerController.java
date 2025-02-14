package live.dolang.matching.config.swagger;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import live.dolang.core.domain.user_profile.UserProfile;
import live.dolang.matching.reqeust.MatchingStartRequest;
import live.dolang.matching.reqeust.MatchingStopRequest;
import live.dolang.matching.response.MatchedResponse;
import live.dolang.matching.response.MatchedUser;
import live.dolang.matching.response.MatchedUserTag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/")
@Tag(name = "ws 경로에 대한 메시지 경로", description = "웹소켓 연결 후 송수신 가능한 경로 brokerURL: 'ws://localhost:8300/ws'")
public class SwaggerController {

    @Operation(summary = "매칭 시작 메시지 요청",
            description = """
                    ```javascript
                    stompClient.publish({
                        destination: '/match/start',
                        body: JSON.stringify({'peerId': peerId}),
                    });
                    ```
                    """)
    @GetMapping("match/start")
    public void start(MatchingStartRequest request) {
    }

    @Operation(summary = "매칭 종료 메시지 요청",
            description = """
                    ```javascript
                    stompClient.publish({
                        destination: '/match/stop',
                        body: JSON.stringify({'peerId': peerId}),
                    });
                    ```
                    """)
    @GetMapping("match/stop")
    public void stop(MatchingStopRequest request) {
    }

    @Operation(summary = "매칭완료 메시지를 구독",
            description = """
                    ```javascript
                    client.subscribe('/user/queue/matched', (message) => {
                        const matchResponse = JSON.parse(message.body);
                        console.log(matchResponse);
                    });
                    ```
                    """)
    @GetMapping("user/queue/matched")
    public MatchedResponse match() {
        return MatchedResponse.builder()
                .ownerYN(true)
                .me(new MatchedUser("0e1a55c8-909b-4c60-b8fc-3c63993c4769", 1, "임혁", UserProfile.Gender.M, "https://asdsadas.png", "임혁 닉네임", "ko", "kr", "en", List.of(new MatchedUserTag(1, "코틀린"))))
                .matchedUser(new MatchedUser("1232131321312312412asd123", 2, "수달", UserProfile.Gender.F, "https://asds123213adas.png", "수달 닉네임", "us", "en", "kr", List.of(new MatchedUserTag(1, "Kotlin"))))
                .build();
    }

}
