package live.dolang.matching;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import live.dolang.core.domain.user_profile.UserProfile;
import live.dolang.core.domain.user_profile.repository.UserProfileRepository;
import live.dolang.matching.reqeust.MatchedResponse;
import live.dolang.matching.reqeust.MatchingStartRequest;
import live.dolang.matching.reqeust.MatchingStopRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MatchingService {

    private final UserProfileRepository userProfileRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;

    /**
     * 사용자에게 매칭이 됬음을 통보합니다.
     *
     * @param userId   사용자 id
     * @param response 매칭 성공 응답 객체
     */
    public void sendMessageToUser(String userId, MatchedResponse response) {
        simpMessagingTemplate.convertAndSendToUser(userId, "/queue/matched", response);
    }

    /**
     * 매 5초 마다 매칭 알고리즘을 수행합니다.
     */
    @Scheduled(cron = "*/5 * * * * *")
    private void match() {
        log.info("Match started");

        // Process Korean queue for users with native=en
        Set<String> koQueue = redisTemplate.opsForSet().members("matching:queue:ko");
        List<MatchedUser> koCandidates = processQueue(koQueue, "en");

        // Process English queue for users with native=ko
        Set<String> enQueue = redisTemplate.opsForSet().members("matching:queue:en");
        List<MatchedUser> enCandidates = processQueue(enQueue, "ko");

        int pairCount = Math.min(koCandidates.size(), enCandidates.size());
        for (int i = 0; i < pairCount; i++) {
            MatchedUser userK = koCandidates.get(i);
            MatchedUser userE = enCandidates.get(i);

            removeUserFromQueue("ko", userK);
            removeUserFromQueue("en", userE);

            sendMessageToUser(userK.getUserId().toString(), new MatchedResponse(userE.getPeerId()));
            sendMessageToUser(userE.getUserId().toString(), new MatchedResponse(userK.getPeerId()));
        }
    }

    /**
     * 대기열을 역시리얼화 합니다.
     *
     * @param queue          시리얼화된 매칭 대기열
     * @param requiredNative 매칭에 필요한 모국어
     * @return 역시리얼화된 매칭 대기열
     */
    private List<MatchedUser> processQueue(Set<String> queue, String requiredNative) {
        return Optional.ofNullable(queue).orElse(Collections.emptySet()).stream()
                .map(this::parseUser)
                .filter(Objects::nonNull)
                .filter(u -> requiredNative.equals(u.getNativeLanguageId()))
                .collect(Collectors.toList());
    }

    /**
     * 사용자의 역시리얼화를 수행합니다.
     *
     * @param json 시리얼화 된 사용자 문자열
     * @return 역시리얼화 된 사용자
     */
    private MatchedUser parseUser(String json) {
        try {
            return objectMapper.readValue(json, MatchedUser.class);
        } catch (IOException e) {
            log.error("Failed to parse user JSON: {}", json, e);
            return null;
        }
    }

    /**
     * 사용자의 시리얼화를 수행합니다.
     *
     * @param user 매칭할 사용자
     * @return 시리얼화 된 사용자 문자열
     */
    private String serializeUser(MatchedUser user) {
        try {
            return objectMapper.writeValueAsString(user);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize user: {}", user, e);
            return null;
        }
    }

    /**
     * 인증객체로 부터 사용자 ID 를 얻습니다.
     *
     * @param principal 인증객체
     * @return 사용자 ID
     */
    private Integer getUserId(JwtAuthenticationToken principal) {
        Jwt jwt = (Jwt) principal.getPrincipal();
        return Integer.valueOf(jwt.getId());
    }

    /**
     * 모든 대기열 큐에서 사용자를 빼냅니다.
     *
     * @param userId           사용자 ID
     * @param peerId           피어링 ID
     * @param nativeLanguageId 모국어
     */
    private void removeUserFromAllQueues(Integer userId, String peerId, String nativeLanguageId) {
        MatchedUser user = new MatchedUser(userId, peerId, nativeLanguageId);
        removeUserFromQueue("ko", user);
        removeUserFromQueue("en", user);
    }

    /**
     * 특정 대기열 큐에서 사용자를 제거합니다.
     *
     * @param queue 대기열 큐 이름
     * @param user  제거할 사용자
     */
    private void removeUserFromQueue(String queue, MatchedUser user) {
        String userJson = serializeUser(user);
        if (userJson != null) {
            redisTemplate.opsForSet().remove("matching:queue:" + queue, userJson);
        }
    }

    /**
     * 사용자를 대기열에 등록합니다.
     *
     * @param request   대기 시작 요청 객체
     * @param accessor  Stomp 메시지 헤더
     * @param principal 인증 객체
     */
    public void enrollUser(MatchingStartRequest request, StompHeaderAccessor accessor, JwtAuthenticationToken principal) {
        Integer userId = getUserId(principal);
        String peerId = request.getPeerId();
        UserProfile userProfile = userProfileRepository.findById(userId).orElseThrow();
        String interestLanguageId = userProfile.getInterestLanguageId();
        String nativeLanguageId = userProfile.getNativeLanguageId();
        MatchedUser user = new MatchedUser(userId, peerId, nativeLanguageId);
        try {
            String userJson = objectMapper.writeValueAsString(user);
            redisTemplate.opsForSet().add("matching:queue:" + interestLanguageId, userJson);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize user data for userId: {}", userId, e);
        }
    }

    /**
     * 사용자를 대기열에서 빼냅니다.
     *
     * @param request   대기 시작 요청 객체
     * @param accessor  Stomp 메시지 헤더
     * @param principal 인증 객체
     */
    public void dropOutUser(MatchingStopRequest request, StompHeaderAccessor accessor, JwtAuthenticationToken principal) {
        Integer userId = getUserId(principal);
        String peerId = request.getPeerId();
        UserProfile userProfile = userProfileRepository.findById(userId).orElseThrow();
        String nativeLanguageId = userProfile.getNativeLanguageId();
        removeUserFromAllQueues(userId, peerId, nativeLanguageId);
    }

}
