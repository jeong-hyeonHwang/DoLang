package live.dolang.authorization;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "live.dolang")
@OpenAPIDefinition(
        info = @Info(title = "두랭 OAuth2 API", version = "v1", description = "두랭 OAuth2 Authorization Server API")
)
public class DoLangAuthorizationApplication {

    public static void main(String[] args) {
        SpringApplication.run(DoLangAuthorizationApplication.class, args);
    }
}
