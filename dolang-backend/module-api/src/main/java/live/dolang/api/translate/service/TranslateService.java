package live.dolang.api.translate.service;

import org.springframework.beans.factory.annotation.Value;
import live.dolang.api.translate.dto.TranslateRequest;
import live.dolang.api.translate.dto.TranslateResponse;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;

@Service
public class TranslateService {

    @Value("${deepl.api.key}")
    private String DEEPL_API_KEY;

    private final String DEEPL_API_URL = "https://api-free.deepl.com/v2/translate";

    private final RestTemplate restTemplate = new RestTemplate();

    public TranslateResponse translate(TranslateRequest request) {
        String targetLang = request.getTarget_lang();

        String url = DEEPL_API_URL + "?target_lang=" + targetLang;

        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "DeepL-Auth-Key " + DEEPL_API_KEY);

        return restTemplate.postForObject(url, new HttpEntity<>(request, headers), TranslateResponse.class);
    }
}
