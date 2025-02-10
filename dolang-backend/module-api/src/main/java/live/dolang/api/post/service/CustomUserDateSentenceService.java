package live.dolang.api.post.service;

import live.dolang.core.domain.user_date_sentence.repository.UserDateSentenceRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CustomUserDateSentenceService {
    private final UserDateSentenceRepository userDateSentenceRepository;
    private final S3Client s3Client;
    @Value("${aws.s3.bucket}")
    private String bucket;
    public boolean isUserDateSentenceExists(Integer userDateSentenceId) {
        return userDateSentenceRepository.findById(userDateSentenceId).isEmpty();
    }

    public String uploadTest(MultipartFile file) throws IllegalAccessException {
        if(file.isEmpty()) {
            throw new IllegalAccessException("파일이 비어있습니다.");
        }
        String fileName = "post-voice/"+ UUID.randomUUID()+"_"+file.getOriginalFilename();
        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucket)
                .key(fileName)
                .contentType(file.getContentType())
                .build();
        try {
            s3Client.putObject(request, RequestBody.fromInputStream(file.getInputStream(),file.getSize()));
            return s3Client.utilities().getUrl(builder -> builder.bucket(bucket).key(fileName)).toString();
        } catch (IOException e) {
            throw new RuntimeException("S3 업로드 실패!!", e);
        }
    }
}
