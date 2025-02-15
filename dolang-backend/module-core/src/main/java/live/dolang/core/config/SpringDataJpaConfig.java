package live.dolang.core.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(
        basePackages = "live.dolang.core.domain"
)
public class SpringDataJpaConfig {
}
