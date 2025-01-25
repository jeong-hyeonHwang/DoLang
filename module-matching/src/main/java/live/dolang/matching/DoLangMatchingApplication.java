package live.dolang.matching;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "live.dolang")
public class DoLangMatchingApplication {

    public static void main(String[] args) {
        SpringApplication.run(DoLangMatchingApplication.class, args);
    }

}
