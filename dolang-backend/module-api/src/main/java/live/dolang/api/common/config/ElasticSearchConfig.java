package live.dolang.api.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;

@Configuration
@EnableElasticsearchRepositories("live.dolang.api")
public class ElasticSearchConfig {
}
