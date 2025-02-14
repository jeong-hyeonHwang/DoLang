package live.dolang.api.call.service;

import live.dolang.api.call.dto.*;
import live.dolang.api.call.repository.CallRepository;
import live.dolang.api.common.exception.BadRequestException;
import live.dolang.api.common.response.BaseResponseStatus;
import live.dolang.core.domain.user.User;
import live.dolang.core.domain.user_call.UserCall;
import live.dolang.core.domain.user_call.repository.UserCallRepository;
import live.dolang.core.domain.user_call_detail.UserCallDetail;
import live.dolang.core.domain.user_call_detail.repository.UserCallDetailRepository;
import live.dolang.core.domain.user_profile.UserProfile;
import live.dolang.core.domain.user_profile.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class CallService {

    private final CallRepository callRepository;
    private final UserCallRepository userCallRepository;
    private final UserCallDetailRepository userCallDetailRepository;
    private final UserProfileRepository userProfileRepository;

    /**
     * 통화 페이징 요청 결과를 반환합니다.
     *
     * @param userId  사용자 ID
     * @param request {@link CallPageRequest} 통화 페이징 요청 객체
     * @return {@link CallPageResponse}
     */
    public CallPageResponse getCallPage(Integer userId, CallPageRequest request) {
        Page<CallPageDto> callPage = callRepository.getCallPage(userId, request.toPageable());
        return new CallPageResponse(callPage);
    }

    /**
     * 통화를 시작합니다.
     *
     * @param userId  사용자 ID
     * @param request {@link StartCallRequest} 통화 시작 요청 객체
     * @return {@link StartCallResponse}
     */
    @Transactional
    public StartCallResponse startCall(Integer userId, StartCallRequest request) {

        // 0. 준비물 (사용자 프로필)
        UserProfile userProfile1 = userProfileRepository.findById(userId)
                .orElseThrow(() -> new BadRequestException(BaseResponseStatus.INVALID_REQUEST));
        Integer matchedUserId = request.getMatchedUserId();
        UserProfile userProfile2 = userProfileRepository.findById(matchedUserId)
                .orElseThrow(() -> new BadRequestException(BaseResponseStatus.INVALID_REQUEST));


        // 1. 통화 생성
        Instant now = Instant.now();
        UserCall userCall = userCallRepository.save(
                UserCall.builder()
                        .startedAt(now)
                        .endedAt(now)
                        .build()
        );

        // 2. 2개의 통화 상세 생성
        userCallDetailRepository.save(
                UserCallDetail.builder()
                        .user(User.builder().id(userId).build())
                        .userCall(userCall)
                        .nativeLanguageId(userProfile1.getNativeLanguageId())
                        .interestLanguageId(userProfile1.getInterestLanguageId())
                        .build()
        );
        userCallDetailRepository.save(
                UserCallDetail.builder()
                        .user(User.builder().id(matchedUserId).build())
                        .userCall(userCall)
                        .nativeLanguageId(userProfile2.getNativeLanguageId())
                        .interestLanguageId(userProfile2.getInterestLanguageId())
                        .build()
        );

        return new StartCallResponse(userCall.getId());
    }

    /**
     * 통화를 종료합니다.
    *
     * @param request {@link StopCallRequest} 통화 종료 요청 객체
     */
    @Transactional
    public void endCall(StopCallRequest request) {
        UserCall userCall = userCallRepository.findById(request.getCallId())
                .orElseThrow(() -> new BadRequestException(BaseResponseStatus.INVALID_PARAMETER));
        userCall.endCall();
    }
}
