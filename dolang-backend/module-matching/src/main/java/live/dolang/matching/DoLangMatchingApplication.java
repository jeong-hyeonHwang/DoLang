package live.dolang.matching;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@ComponentScan(basePackages = "live.dolang")
@EnableScheduling
public class DoLangMatchingApplication {

    public static void main(String[] args) {
        SpringApplication.run(DoLangMatchingApplication.class, args);
    }

}
