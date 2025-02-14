package live.dolang.matching.config.swagger;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(info = @Info(title = "웹소켓 매칭 서버 ", version = "v1", description = "요청 응답 모델만을 보여주는 API입니다."))
public class OpenApiConfig {

}
