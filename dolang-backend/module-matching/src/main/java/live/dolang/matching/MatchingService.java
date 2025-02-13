package live.dolang.matching;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import live.dolang.core.domain.user_profile.UserProfile;
import live.dolang.core.domain.user_profile.repository.UserProfileRepository;
import live.dolang.matching.reqeust.MatchingStartRequest;
import live.dolang.matching.reqeust.MatchingStopRequest;
import live.dolang.matching.response.MatchedResponse;
import live.dolang.matching.response.MatchedUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
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
    private final MatchingRepository matchingRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;

    /**
     * 사용자에게 매칭이 됬음을 통보합니다.
     *
     * @param username jwt subject
     * @param response 매칭 성공 응답 객체
     */
    public void sendMessageToUser(String username, MatchedResponse response) {
        simpMessagingTemplate.convertAndSendToUser(username, "/queue/matched", response);
    }

    /**
     * 3초의 간격을 두고 실행합니다.
     */
    @Scheduled(fixedDelay = 3000)
    private void match() {

        // Process Korean queue for users with native=en
        Set<String> koQueue = redisTemplate.opsForSet().members("matching:queue:ko");
        List<MatchingUser> koCandidates = processQueue(koQueue, "en");

        // Process English queue for users with native=ko
        Set<String> enQueue = redisTemplate.opsForSet().members("matching:queue:en");
        List<MatchingUser> enCandidates = processQueue(enQueue, "ko");
        log.info("Matching... ko: {} en: {}", koCandidates.size(), enCandidates.size());

        // 태그 비교를 통한 매칭
        List<MatchingPair> matchingPairs = new ArrayList<>();
        for (MatchingUser koUser : koCandidates) {
            for (MatchingUser enUser : enCandidates) {
                if (hasCommonTag(koUser.getTagIdList(), enUser.getTagIdList())) {
                    matchingPairs.add(new MatchingPair(koUser, enUser));
                    enCandidates.remove(enUser); // 반복문에서 제거
                    break;
                }
            }
        }


        for (MatchingPair pair : matchingPairs) {
            MatchingUser userK = pair.koUser;
            MatchingUser userE = pair.enUser;
            log.info("Matched!!! userK: {} userE: {}", userK.getUserId(), userE.getUserId());

            removeUserFromQueue("ko", userK);
            removeUserFromQueue("en", userE);

            // userK 의 좀더 자세한 사용자 프로필 정보 조회
            MatchedUser detailUserK = matchingRepository.getMatchedDetailUser(userK.getUserId());
            detailUserK.setPeerId(userK.getPeerId());
            detailUserK.setUserId(userK.getUserId());
            detailUserK.setUsername(userK.getUsername());
            // 태그도 저장
            detailUserK.setUserTagList(matchingRepository.getMatchedDetailUserTagList(userK.getUserId()));

            // userE 의 좀더 자세한 사용자 프로필 정보 조회
            MatchedUser detailUserE = matchingRepository.getMatchedDetailUser(userE.getUserId());
            detailUserE.setPeerId(userE.getPeerId());
            detailUserE.setUserId(userE.getUserId());
            detailUserE.setUsername(userE.getUsername());
            // 태그도 저장
            detailUserE.setUserTagList(matchingRepository.getMatchedDetailUserTagList(userE.getUserId()));

            MatchedResponse responseE = MatchedResponse.builder()
                    .matchedUser(detailUserE)
                    .me(detailUserK)
                    .ownerYN(true).build();
            MatchedResponse responseK = MatchedResponse.builder()
                    .matchedUser(detailUserK)
                    .me(detailUserE)
                    .ownerYN(false).build();

            sendMessageToUser(userK.getUsername(), responseE);
            sendMessageToUser(userE.getUsername(), responseK);
        }

    }

    /**
     * 태그 리스트를 이분 탐색하여 하나라도 일치하는지 여부를 반환합니다.
     *
     * @param tagList1 태그 리스트 1
     * @param tagList2 태그 리스트 2
     * @return 태그 리스트 하나라도 일치 여부
     */
    private boolean hasCommonTag(List<Integer> tagList1, List<Integer> tagList2) {
        if (tagList1 == null || tagList2 == null || tagList1.isEmpty() || tagList2.isEmpty()) {
            return false;
        }
        for (Integer tag : tagList1) {
            if (Collections.binarySearch(tagList2, tag) >= 0) {
                return true;
            }
        }
        return false;
    }

    /**
     * 대기열을 역시리얼화 합니다.
     *
     * @param queue          시리얼화된 매칭 대기열
     * @param requiredNative 매칭에 필요한 모국어
     * @return 역시리얼화된 매칭 대기열
     */
    private List<MatchingUser> processQueue(Set<String> queue, String requiredNative) {
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
    private MatchingUser parseUser(String json) {
        try {
            return objectMapper.readValue(json, MatchingUser.class);
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
    private String serializeUser(MatchingUser user) {
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
     * @param username         jwt subject
     * @param peerId           피어링 ID
     * @param nativeLanguageId 모국어
     * @param tagIdList        태그 ID 목록
     */
    private void removeUserFromAllQueues(Integer userId, String username, String peerId, String nativeLanguageId, List<Integer> tagIdList) {
        MatchingUser user = new MatchingUser(userId, username, peerId, nativeLanguageId, tagIdList);
        removeUserFromQueue("ko", user);
        removeUserFromQueue("en", user);
    }

    /**
     * 특정 대기열 큐에서 사용자를 제거합니다.
     *
     * @param queue 대기열 큐 이름
     * @param user  제거할 사용자
     */
    private void removeUserFromQueue(String queue, MatchingUser user) {
        String userJson = serializeUser(user);
        if (userJson != null) {
            redisTemplate.opsForSet().remove("matching:queue:" + queue, userJson);
        }
    }

    /**
     * 사용자를 대기열에 등록합니다.
     *
     * @param request   대기 시작 요청 객체
     * @param principal 인증 객체
     */
    public void enrollUser(MatchingStartRequest request, JwtAuthenticationToken principal) {
        Integer userId = getUserId(principal);
        String username = principal.getName();
        String peerId = request.getPeerId();
        UserProfile userProfile = userProfileRepository.findById(userId).orElseThrow();
        String interestLanguageId = userProfile.getInterestLanguageId();
        String nativeLanguageId = userProfile.getNativeLanguageId();
        List<Integer> tagIdList = matchingRepository.findUserTagIdListOrderByTagId(userId);
        MatchingUser user = new MatchingUser(userId, username, peerId, nativeLanguageId, tagIdList);
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
     * @param principal 인증 객체
     */
    public void dropOutUser(MatchingStopRequest request, JwtAuthenticationToken principal) {
        Integer userId = getUserId(principal);
        String username = principal.getName();
        String peerId = request.getPeerId();
        UserProfile userProfile = userProfileRepository.findById(userId).orElseThrow();
        String nativeLanguageId = userProfile.getNativeLanguageId();
        List<Integer> tagIdList = matchingRepository.findUserTagIdListOrderByTagId(userId);
        removeUserFromAllQueues(userId, username, peerId, nativeLanguageId, tagIdList);
    }

}
