package live.dolang.api;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.configuration.JobRegistry;
import org.springframework.batch.core.launch.NoSuchJobException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.fail;

@SpringBootTest
class DoLangApiApplicationTests {

    @Autowired
    private JobRegistry jobRegistry;

    @Test
    @DisplayName("JobRegistry 에 Job 이 등록되어 있어야 한다.")
    void test() {

        try {
            Job job = jobRegistry.getJob("redisHeartToDatabaseJob");
            assertEquals("redisHeartToDatabaseJob", job.getName());
        } catch (NoSuchJobException e) {
            fail();
        }
    }

    @Test
    void contextLoads() {
    }

}
