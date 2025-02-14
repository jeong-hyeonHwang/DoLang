package live.dolang.api.user;

import live.dolang.api.common.exception.NotFoundException;
import live.dolang.api.common.response.BaseResponseStatus;
import live.dolang.api.user.service.CustomUserService;
import live.dolang.core.domain.user.User;
import live.dolang.core.domain.user.repository.UserRepository;
import live.dolang.core.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class UserTest {
    @Autowired
    private CustomUserService customUserService;
    @Autowired
    private UserRepository userRepository;

    @Test
    @Transactional
    @Rollback
    public void deleteUserTest() {
        //Given
        int userId = 1;

        //When
        customUserService.deleteUser(1);

        //Then
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException(BaseResponseStatus.NOT_EXIST_USER));
        assertTrue(user.isDeleted(), "정상적으로 삭제처리 되었습니다.");
        assertEquals(user.getUserProfile().getNickname(),"탈퇴한 사용자","정상적으로 삭제되었습니다.");
    }
}
