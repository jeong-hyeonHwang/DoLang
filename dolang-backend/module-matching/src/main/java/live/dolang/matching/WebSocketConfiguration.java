package live.dolang.matching;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.lang.NonNull;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.util.StringUtils;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.security.Principal;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfiguration implements WebSocketMessageBrokerConfigurer {

    private final TaskScheduler messageBrokerTaskScheduler;
    private final JwtDecoder jwtDecoder;

    public WebSocketConfiguration(@Lazy TaskScheduler messageBrokerTaskScheduler, JwtDecoder jwtDecoder) {
        this.messageBrokerTaskScheduler = messageBrokerTaskScheduler;
        this.jwtDecoder = jwtDecoder;
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*");
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {

        registry
                // client -> server
                .setApplicationDestinationPrefixes("/match")
                // server -> client
                .enableSimpleBroker("/queue")
                // STOMP heartbeats. (server, write)
                .setHeartbeatValue(new long[]{10000, 20000})
                .setTaskScheduler(messageBrokerTaskScheduler);
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(@NonNull Message<?> message, @NonNull MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
                if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
                    // Access authentication header(s) and invoke accessor.setUser(user)
                    String authorization = accessor.getFirstNativeHeader("Authorization");
                    if (StringUtils.hasText(authorization)) {
                        String token = authorization.replace("Bearer ", "");
                        Jwt jwt = jwtDecoder.decode(token);
                        JwtAuthenticationToken authentication = new JwtAuthenticationToken(jwt);
                        accessor.setUser(authentication);
                    }
                }
                return message;
            }
        });
    }
}