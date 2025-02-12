package live.dolang.api.note.service;

import live.dolang.api.common.exception.NotFoundException;
import live.dolang.api.common.response.BaseResponseStatus;
import live.dolang.api.note.document.UserNoteDocument;
import live.dolang.api.note.dto.UserNoteRequestDto;
import live.dolang.api.note.repository.ElasticSearchUserNoteRepository;
import live.dolang.core.domain.user.User;
import live.dolang.core.domain.user.repository.UserRepository;
import live.dolang.core.domain.user_note.UserNote;
import live.dolang.core.domain.user_note.repository.UserNoteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserNoteService {

    private final UserNoteRepository userNoteRepository;
    private final ElasticSearchUserNoteRepository elasticSearchUserNoteRepository;
    private final UserRepository userRepository;

    // MySQL 과 Elasticsearch 에 저장
    @Transactional
    public void saveUserNote(int userId, UserNoteRequestDto requestDto) {

        // user 가 데이터 상에 존재하는지 확인
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException(BaseResponseStatus.NOT_EXIST_USER));

        // MySQL 저장
        UserNote userNote = UserNote.builder()
                .user(user)
                .nativeNote(requestDto.getNativeNote())
                .interestNote(requestDto.getInterestNote())
                .nativeLanguageId(requestDto.getNativeLanguageId())
                .interestLanguageId(requestDto.getInterestLanguageId())
                .createdAt(Instant.now()) // 현재 시간 저장
                .build();
        userNoteRepository.save(userNote);

        // Elasticsearch 에 저장 (UserNoteDocument 변환)
        UserNoteDocument userNoteDocument = UserNoteDocument.builder()
                .id(userNote.getId().toString())
                .userId(userId)
                .nativeNote(requestDto.getNativeNote())
                .interestNote(requestDto.getInterestNote())
                .nativeLanguageId(requestDto.getNativeLanguageId())
                .interestLanguageId(requestDto.getInterestLanguageId())
                .createdAt(userNote.getCreatedAt())
                .build();
        elasticSearchUserNoteRepository.save(userNoteDocument);

    }

    // Elasticsearch 에서 ID 로 조회 ( 장애 시 mysql )
    public Page<UserNoteDocument> getUserNoteById(Integer userId, int page, int size) {
        // 유저 정보 먼저 조회
        return elasticSearchUserNoteRepository.findByUserId(userId, PageRequest.of(page, size));
    }

    // Elasticsearch 에서 키워드 검색
    public Page<UserNoteDocument> searchUserNotes(Integer userId, String keyword, int page, int size) {
        return elasticSearchUserNoteRepository.searchNotesByUserIdAndKeyword(userId, keyword, PageRequest.of(page, size));
    }


}
