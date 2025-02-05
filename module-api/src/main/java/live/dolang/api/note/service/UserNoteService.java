package live.dolang.api.note.service;

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

    // MySQL과 Elasticsearch에 저장
    @Transactional
    public boolean saveUserNote(UserNoteRequestDto requestDto) {

        // try-catch로 데이터 무결성 검증
        try {
            // user가 데이터 상에 존재하는지 확인
            User user = userRepository.findById(requestDto.getUserId())
                    .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + requestDto.getUserId()));

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

            // Elasticsearch에 저장 (UserNoteDocument 변환)
            UserNoteDocument userNoteDocument = UserNoteDocument.builder()
                    .id(userNote.getId().toString())
                    .userId(requestDto.getUserId())
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

    // ElasticSearch, MySQL에서 ID로 조회
    public List<UserNoteDocument> getUserNoteById(Integer userId) {
        // 유저 정보 먼저 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        try {
            // Elasticsearch에서 조회
            return userNoteSearchRepository.findByUserId(userId);
        } catch (Exception e) {
            // ES 장애 시, MySQL에서 조회
            return convertToDocumentList(userNoteRepository.findByUser(user));
        }
    }


    // Elasticsearch에서 키워드 검색
    public List<UserNoteDocument> searchUserNotes(Integer userId, String keyword) {
        return userNoteSearchRepository.searchNotesByUserIdAndKeyword(userId, keyword);
    }

    //UserNote (MySQL 데이터) → UserNoteDocument (ES 문서) 변환
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
