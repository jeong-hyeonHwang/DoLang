![message-flow-simple-broker.png](message-flow-simple-broker.png)
### ✅ MessageBroker란?
MessageBroker(메시지 브로커)는 **WebSocket을 통해 메시지를 주고받을 수 있도록 중계 역할을 하는 컴포넌트**입니다.  
즉, **클라이언트 간 메시지를 라우팅(전달)하는 역할**을 합니다.

#### ✅ MessageBroker의 동작 방식
- **클라이언트 → 서버로 메시지 전송** (`@MessageMapping`)
    - `setApplicationDestinationPrefixes("/app")`을 통해 클라이언트가 `"/app/xxx"`로 보낸 메시지가 **Spring Controller로 전달**됨
    - Controller는 메시지를 처리한 후 브로커로 메시지를 보냄


- **서버 → 클라이언트로 메시지 전송** (`enableSimpleBroker("/queue/", "/topic/")`)
    - `enableSimpleBroker()`를 통해 **브로커가 메시지를 해당 채널을 구독한 클라이언트에게 전달**
    - 예: 클라이언트가 `"/topic/chat"`을 구독하면, 해당 경로로 오는 메시지를 받을 수 있음
    

### ✅ MessageChannel란?
- STOMP 메시지가 **서버 내부에서 이동하는 경로**
- **MessageBroker, Controller, Interceptor 등이 메시지를 주고받을 때 MessageChannel을 사용**
- 기본적으로 **InboundChannel, OutboundChannel으로 나뉨**