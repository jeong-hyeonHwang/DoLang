package live.dolang.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "live.dolang")
public class DoLangApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(DoLangApiApplication.class, args);
    }

}
