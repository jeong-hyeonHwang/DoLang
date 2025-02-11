package live.dolang.matching;

import live.dolang.core.domain.tag.Tag;
import live.dolang.core.domain.tag.repository.TagRepository;
import live.dolang.core.domain.user.User;
import live.dolang.core.domain.user.repository.UserRepository;
import live.dolang.core.domain.user_tag.UserTag;
import live.dolang.core.domain.user_tag.repository.UserTagRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@SpringBootTest
class MatchingUserTagRepositoryTest {

    @Autowired
    UserRepository userRepository;

    @Autowired
    TagRepository tagRepository;

    @Autowired
    MatchingUserTagRepository matchingUserTagRepository;

    @Autowired
    UserTagRepository userTagRepository;


    @Test
    @DisplayName("특정 사용자에 대한 태그 ID 목록을 반환")
    @Rollback
    @Transactional
    void findUserTagIdListOrderByTagId() {

        User user = userRepository.save(User.builder()
                .email("cs.javah@kakao.com")
                .googleId("1232131")
                .build());

        Tag tag1 = tagRepository.save(Tag.builder()
                .name("안녕1")
                .nativeLanguageId("ko")
                .build());

        Tag tag2 = tagRepository.save(Tag.builder()
                .name("안녕2")
                .nativeLanguageId("ko")
                .build());


        userTagRepository.save(UserTag.builder()
                .tag(tag1)
                .user(user).build());

        userTagRepository.save(UserTag.builder()
                .tag(tag2)
                .user(user).build());

        List<Integer> userTagIdList = matchingUserTagRepository.findUserTagIdListOrderByTagId(user.getId());
        Assertions.assertEquals(2, userTagIdList.size());
    }
}