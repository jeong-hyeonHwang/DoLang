package live.dolang.api.user.service;

import live.dolang.api.common.exception.DuplicateException;
import live.dolang.api.common.exception.NotFoundException;
import live.dolang.api.common.response.BaseResponseStatus;
import live.dolang.api.user.dto.*;
import live.dolang.api.user.repository.CustomUserRepository;
import live.dolang.core.domain.tag.Tag;
import live.dolang.core.domain.tag.repository.TagRepository;
import live.dolang.core.domain.user.User;
import live.dolang.core.domain.user.repository.UserRepository;
import live.dolang.core.domain.user_language_level.UserLanguageLevel;
import live.dolang.core.domain.user_language_level.repository.UserLanguageLevelRepository;
import live.dolang.core.domain.user_profile.UserProfile;
import live.dolang.core.domain.user_profile.repository.UserProfileRepository;
import live.dolang.core.domain.user_tag.UserTag;
import live.dolang.core.domain.user_tag.repository.UserTagRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomUserService {
    private final CustomUserRepository customUserRepository;
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final UserTagRepository userTagRepository;
    private final TagRepository tagRepository;
    private final UserLanguageLevelRepository userLanguageLevelRepository;
    private final S3Client s3Client;
    @Value("${aws.s3.bucket}")
    private String bucket;

    /**
     * 유저 정보 조회
     */
    public ResponseUserInfoDto getUserInfo(int userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException(BaseResponseStatus.NOT_EXIST_USER));

        ResponseUserInfoDto responseUserInfoDto = customUserRepository.getUserInfo(userId)
                .orElseThrow(() -> new NotFoundException(BaseResponseStatus.NOT_EXIST_USER_PROFILE));

        List<TagDto> tags = customUserRepository.getUserTagList(userId);
        responseUserInfoDto.updateTags(tags);
        return responseUserInfoDto;
    }

    /**
     * 유저 정보 등록
     */
    @Transactional
    public void registerUserInfo(int userId, RequestRegisterUserProfileDto requestRegisterUserProfileDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException(BaseResponseStatus.NOT_EXIST_USER));
        if (userProfileRepository.existsById(userId)) {
            throw new DuplicateException(BaseResponseStatus.DUPLICATE_USER);
        }

        //유저 프로파일 저장
        UserProfile userProfile = requestRegisterUserProfileDto.toUserProfileEntity(userId);
        userProfileRepository.save(userProfile);

        //유저 관심사 태그저장
        List<Integer> tags = requestRegisterUserProfileDto.getInterests();
        List<UserTag> userTags = tags.stream()
                .map(tagId -> new UserTag(null, user, tagRepository.getReferenceById(tagId)))
                .toList();
        userTagRepository.saveAll(userTags);

        //유저 관심언어 수준, 모국어 수준 저장
        List<UserLanguageLevel> userLanguageLevelsList = new ArrayList<>();
        userLanguageLevelsList.add(UserLanguageLevel.builder()
                .user(user)
                .languageId(requestRegisterUserProfileDto.getNativeLanguage())
                .languageLevelId("SS")
                .build()
        );
        userLanguageLevelsList.add(UserLanguageLevel.builder()
                .user(user)
                .languageId(requestRegisterUserProfileDto.getTargetLanguage())
                .languageLevelId(requestRegisterUserProfileDto.getProficiencyLevel())
                .build()
        );
        userLanguageLevelRepository.saveAll(userLanguageLevelsList);
    }

    /**
     * 유저 정보 수정
     */
    @Transactional
    public void updateUserInfo(int userId, RequestUpdateUserInfoDto requestUpdateUserInfoDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException(BaseResponseStatus.NOT_EXIST_USER));
        MultipartFile image = requestUpdateUserInfoDto.getProfileImage();
        UserProfile originProfile = user.getUserProfile();

        UserProfile newProfile = requestUpdateUserInfoDto.toUserProfileEntity(userId);

        //사용자 이미지 추가
        if(image != null && !image.isEmpty()) { //사용자가 이미지를 추가했다면
            // TODO:기존이미지가 있고, 수정되었다면, 기존이미지 S3에서 삭제해야함
            String imageUrl = uploadImageToS3(image);
            newProfile.updateProfileImageUrl(imageUrl);
        }
        else { //사용자가 이미지를 추가하지 않았다면 기존 프로파일 주소를 사용
            newProfile.updateProfileImageUrl(originProfile.getProfileImageUrl());
        }
        user.updateProfile(newProfile);

        //언어수준 수정
        updateUserLanguageLevel(requestUpdateUserInfoDto, user);

        //사용자 관심사 태그 수정(기존 태그삭제 후 새로운 태그 저장)
        updateUserTags(requestUpdateUserInfoDto, user);
    }


    private String uploadImageToS3(MultipartFile image) {
        String fileName = "profile-image/"+ UUID.randomUUID()+"_"+image.getOriginalFilename();
        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucket)
                .key(fileName)
                .contentType(image.getContentType())
                .build();
        try {
            s3Client.putObject(request, RequestBody.fromInputStream(image.getInputStream(),image.getSize()));
        } catch (IOException e) {
            log.error("AWS S3 업로드에 실패했습니다.");
            e.printStackTrace();
        }
        return s3Client.utilities().getUrl(builder -> builder.bucket(bucket).key(fileName)).toString();
    }
    private void updateUserLanguageLevel(RequestUpdateUserInfoDto requestUpdateUserInfoDto, User user) {
        String newInterestLanguageId = requestUpdateUserInfoDto.getTargetLanguage();
        String newInterestLanguageLevelId = requestUpdateUserInfoDto.getProficiencyLevel();
        //사용자의 언어수준들을 조회
        Set<UserLanguageLevel> originLanguageLevelSet = userLanguageLevelRepository.findByUserId(user.getId());
        //수정하려는 관심언어의 수준이 기존에 저장되어 있던 언어인지 확인
        UserLanguageLevel existingUserLanguageLevel = isExistUserLanguageLevel(originLanguageLevelSet, newInterestLanguageId);
        //수정된 관심언어가 언어수준 테이블에 저장이 안되어있다면 새롭게 저장
        if (existingUserLanguageLevel == null) {
            UserLanguageLevel newUserLanguageLevel = UserLanguageLevel.builder()
                    .user(user)
                    .languageId(newInterestLanguageId)
                    .languageLevelId(newInterestLanguageLevelId)
                    .build();
            userLanguageLevelRepository.save(newUserLanguageLevel);
        }
        //수정된 관심언어가 언어수준 테이블에 저장이 되어있다면 새롭게 수정
        else {
            existingUserLanguageLevel.updateLanguageLevelId(newInterestLanguageLevelId);
        }
    }
    private UserLanguageLevel isExistUserLanguageLevel(Set<UserLanguageLevel> originUserLanguageLevelSet, String languageId) {
        return originUserLanguageLevelSet.stream()
                .filter(userLanguageLevel -> userLanguageLevel.getLanguageId().equals(languageId))
                .findFirst()
                .orElse(null);
    }

    private void updateUserTags(RequestUpdateUserInfoDto requestUpdateUserInfoDto, User user) {
        List<UserTag> originUserTags = userTagRepository.findByUser(user);
        userTagRepository.deleteAllInBatch(originUserTags);

        List<UserTag> userTags = requestUpdateUserInfoDto.getInterests().stream()
                .map(tagId-> new UserTag(null, user, tagRepository.getReferenceById(tagId)))
                .toList();
        userTagRepository.saveAll(userTags);
    }


    /**
     * 유저 관심사ID 리스트 조회
     */
    public List<ResponseUserTagIdDto> getUserTagIds(int userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException(BaseResponseStatus.NOT_EXIST_USER));
        return customUserRepository.getUserTagList(userId).stream()
                .map(tag -> ResponseUserTagIdDto.builder()
                        .tagId(tag.getTagId())
                        .build())
                .toList();
    }

    /**
     * 회원 탈퇴
     */
    public void deleteUser(int userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException(BaseResponseStatus.NOT_EXIST_USER));
        user.deleteUser();
        //TODO: 탈퇴한 회원이 재가입할 떄 로직을 처리해야함
    }

}
