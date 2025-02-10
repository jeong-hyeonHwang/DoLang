package live.dolang.api.note.service;

import live.dolang.api.common.exception.NotFoundException;
import live.dolang.api.common.response.BaseResponseStatus;
import live.dolang.api.note.document.UserNoteDocument;
import live.dolang.api.note.dto.UserNoteRequestDto;
import live.dolang.api.note.repository.UserNoteSearchRepository;
import live.dolang.core.domain.user.User;
import live.dolang.core.domain.user.repository.UserRepository;
import live.dolang.core.domain.user_note.UserNote;
import live.dolang.core.domain.user_note.repository.UserNoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserNoteService {

    private final UserNoteRepository userNoteRepository;
    private final UserNoteSearchRepository userNoteSearchRepository;
    private final UserRepository userRepository;

    // MySQL 과 Elasticsearch 에 저장
    @Transactional
    public boolean saveUserNote(int userId, UserNoteRequestDto requestDto) {

        // try-catch 로 데이터 무결성 검증
        try {
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
            userNoteSearchRepository.save(userNoteDocument);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // Elasticsearch 에서 ID 로 조회 ( 장애 시 mysql )
    public List<UserNoteDocument> getUserNoteById(Integer userId) {
        // 유저 정보 먼저 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException(BaseResponseStatus.NOT_EXIST_USER));

        try {
            // Elasticsearch 에서 조회
            return userNoteSearchRepository.findByUserId(userId);
        } catch (Exception e) {
            // ES 장애 시, MySQL 에서 조회
            return convertToDocumentList(userNoteRepository.findByUser(user));
        }
    }

    // Elasticsearch 에서 키워드 검색
    public List<UserNoteDocument> searchUserNotes(Integer userId, String keyword) {
        return userNoteSearchRepository.searchNotesByUserIdAndKeyword(userId, keyword);
    }

    // UserNote (MySQL 데이터) → UserNoteDocument (ES 문서) 변환
    private List<UserNoteDocument> convertToDocumentList(List<UserNote> userNotes) {
        return userNotes.stream().map(note ->
                UserNoteDocument.builder()
                        .id(note.getId().toString())
                        .userId(note.getUser().getId())
                        .nativeNote(note.getNativeNote())
                        .interestNote(note.getInterestNote())
                        .nativeLanguageId(note.getNativeLanguageId())
                        .interestLanguageId(note.getInterestLanguageId())
                        .createdAt(note.getCreatedAt())
                        .build()
        ).toList();
    }


}
