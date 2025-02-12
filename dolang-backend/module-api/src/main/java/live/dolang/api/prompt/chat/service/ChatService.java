package live.dolang.api.prompt.chat.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import live.dolang.api.prompt.chat.dto.RequestChatQuestionDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ChatService {

    @Value("${openAi.apiKey}")
    private String OPENAI_API_KEY;
    @Value("${openAi.apiUrl}")
    private String OPENAI_API_URL;

    public List<String> getChatQuestion(RequestChatQuestionDto requestChatQuestionDto) {
        // 1. 관심사 리스트를 이용해 ChatGPT에게 질문 요청
        String prompt = buildPrompt(requestChatQuestionDto);
        String response = getChatGptResponse(prompt);
        // 2. ChatGPT로부터 받은 응답을 적절히 파싱하여 반환
        return parseChatGptResponse(response);
    }

    private String buildPrompt(RequestChatQuestionDto requestChatQuestionDto) {
        // 관심사 A와 B에 대한 질문을 생성할 프롬프트
        String prompt = "처음 만난 두 사람의 small talk 질문 5개를 추천해줘.\n"
                +"A의 관심사 : " + String.join(", ", requestChatQuestionDto.getInterestA()) + ".\n"
                +"B의 관심사 : " + String.join(", ", requestChatQuestionDto.getInterestB()) + ".\n"
                +"응답은 반드시 JSON 배열로만 응답해.\n+"
                +"마크다운과 불필요한 텍스트 없이 순수한 JSON 배열로 반환해.\n";
        return prompt;
    }

    private String getChatGptResponse(String prompt) {
        RestTemplate restTemplate = new RestTemplate();

        // JSON 요청 본문 생성
        Map<String, Object> requestMap = new HashMap<>();
        requestMap.put("model", "gpt-4o-mini"); //사용할 GPT 모델
        requestMap.put("messages", List.of( //메세지 설정
                Map.of("role", "system", "content", "너는 처음 본 두 사람의 관심사를 토대로 스몰톡 주제를 추천해주는 기계야.\n"
                        +"응답은 반드시 JSON 배열로만 응답해.\n+"
                        +"마크다운과 불필요한 텍스트 없이 순수한 JSON 배열로 반환해.\n"),
                Map.of("role", "user", "content", prompt)
        ));
        requestMap.put("max_tokens", 500); // 더 긴 응답을 위해 토큰 수 증가
        requestMap.put("temperature", 0.7);

        // JSON 변환
        ObjectMapper objectMapper = new ObjectMapper();
        String jsonBody;
        try {
            jsonBody = objectMapper.writeValueAsString(requestMap);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("JSON 변환 실패", e);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + OPENAI_API_KEY);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);

        ResponseEntity<String> response = restTemplate.exchange(
                OPENAI_API_URL,
                HttpMethod.POST,
                entity,
                String.class
        );
        return response.getBody();
    }

    private List<String> parseChatGptResponse(String jsonResponse) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            JsonNode rootNode = objectMapper.readTree(jsonResponse);
            String content = rootNode.path("choices").get(0).path("message").path("content").asText();
            return objectMapper.readValue(content, new TypeReference<>() {
            });
        } catch (Exception e) {
            throw new RuntimeException("응답 파싱 실패", e);
        }
    }
}
