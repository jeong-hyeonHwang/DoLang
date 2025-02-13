package live.dolang.api.prompt.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import live.dolang.api.common.exception.InternalServerException;
import live.dolang.api.common.response.BaseResponseStatus;
import live.dolang.api.common.util.UTCTimeUtil;
import live.dolang.api.prompt.dto.RequestChatQuestionDto;
import live.dolang.core.domain.date_sentence.DateSentence;
import live.dolang.core.domain.date_sentence.repository.DateSentenceRepository;
import live.dolang.core.domain.language.Language;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PromptService {
    private final DateSentenceRepository dateSentenceRepository;
    @Value("${openAi.apiKey}")
    private String OPENAI_API_KEY;
    @Value("${openAi.apiUrl}")
    private String OPENAI_API_URL;

    /**
     * 관심사 기반 스몰톡 질문 리스트 조회
     */
    public List<String> getChatQuestion(RequestChatQuestionDto requestChatQuestionDto) {
        // 1. 관심사 리스트를 이용해 ChatGPT에게 질문 요청
        String prompt = buildQuestionPrompt(requestChatQuestionDto);
        String response = getQuestionFromChatGpt(prompt);
        // 2. ChatGPT로부터 받은 응답을 적절히 파싱하여 반환
        return parseChatQuestionResponse(response);
    }

    private String buildQuestionPrompt(RequestChatQuestionDto requestChatQuestionDto) {
        // 관심사 A와 B에 대한 질문을 생성할 프롬프트
        String prompt = "처음 만난 두 사람의 small talk 질문 5개를 추천해줘.\n"
                + "A의 관심사 : " + String.join(", ", requestChatQuestionDto.getInterestA()) + ".\n"
                + "B의 관심사 : " + String.join(", ", requestChatQuestionDto.getInterestB()) + ".\n"
                + "응답은 반드시 JSON 배열로만 응답해.\n+"
                + "마크다운과 불필요한 텍스트 없이 순수한 JSON 배열로 반환해.\n";
        return prompt;
    }

    private String getQuestionFromChatGpt(String prompt) {
        RestTemplate restTemplate = new RestTemplate();

        // JSON 요청 본문 생성
        Map<String, Object> requestMap = new HashMap<>();
        requestMap.put("model", "gpt-4o-mini"); //사용할 GPT 모델
        requestMap.put("messages", List.of( //메세지 설정
                Map.of("role", "system", "content", "너는 처음 본 두 사람의 관심사를 토대로 스몰톡 주제를 추천해주는 기계야.\n"
                        + "응답은 반드시 JSON 배열로만 응답해.\n+"
                        + "마크다운과 불필요한 텍스트 없이 순수한 JSON 배열로 반환해.\n"),
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

    private List<String> parseChatQuestionResponse(String jsonResponse) {
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

    /**
     * 하루 한 문장
     */
    @Transactional
    public void addDateSentence() {
        String prompt = "하루에 한문장 말하기를 연습중이야.\n"
                + "CEFR 기준으로 레벨 B1에 해당하는 한 문장을 만들어줘.\n"
                + "그 후 해당 문장을 한국어와 영어로 한 문장씩 출력해줘.\n"
                + "응답은 반드시 JSON 배열로만 응답해줘.\n"
                + "마크다운과 불필요한 텍스트 없이 순수한 JSON 배열로 반환해줘.\n"
                + "응답은 ISO 언어코드 alpa2로 반환해줘\n"
                + "응답 예시\n"
                + "ko : 안녕하세요";

        String response = getDateSentenceFromChatGPT(prompt);

        List<Map<String,String>> responseDateSentenceList = parseDateSentenceResponse(response)
                .orElseThrow(() -> new InternalServerException(BaseResponseStatus.CHATGPT_RESPONSE_ERROR));

        List<String> responseDateSentenceKeys = List.of("ko","en");
        List<DateSentence> dateSentenceList = new ArrayList<>();

        for(String key : responseDateSentenceKeys) {
            dateSentenceList.add(DateSentence.builder()
                    .sentence(responseDateSentenceList.get(0).get(key))
                    .language(Language.builder().id(key).build())
                    .dateId(UTCTimeUtil.getTodayUTCInstant())
                    .level("B1")
                    .build());
        }
        System.out.println("=====================================");
        for(DateSentence dateSentence : dateSentenceList) {
            System.out.println(dateSentence.getSentence());
        }
        dateSentenceRepository.saveAll(dateSentenceList);
    }

    private String getDateSentenceFromChatGPT(String prompt) {
        RestTemplate restTemplate = new RestTemplate();

        // JSON 요청 본문 생성
        Map<String, Object> requestMap = new HashMap<>();
        requestMap.put("model", "gpt-4o-mini"); //사용할 GPT 모델
        requestMap.put("messages", List.of( //메세지 설정
                Map.of("role", "system", "content", "너는 하루에 한문장을 연습할 수 있도록 문장을 추천해주는 기계야.\n"
                        + "응답은 반드시 JSON 배열로만 응답해.\n"
                        + "마크다운과 불필요한 텍스트 없이 순수한 JSON 배열로 반환해.\n"
                        + "응답은 ISO 언어코드 alpa2로 반환해줘\n"
                        + "응답 예시\n"
                        + "ko : 안녕하세요"
                ),
                Map.of("role", "user", "content", prompt)
        ));
        requestMap.put("max_tokens", 500); // 더 긴 응답을 위해 토큰 수 증가
        requestMap.put("temperature", 1.0);

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

    private static Optional<List<Map<String, String>>> parseDateSentenceResponse(String response) {
        ObjectMapper objectMapper = new ObjectMapper();

        try {
            // JSON 문자열을 Map으로 변환
            Map<String, Object> responseMap = objectMapper.readValue(response, Map.class);

            // "choices" 배열에서 첫 번째 요소의 "message.content" 추출
            List<Map<String, Object>> choices = (List<Map<String, Object>>) responseMap.get("choices");
            if (choices == null || choices.isEmpty()) return null;

            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            if (message == null) return null;

            String contentJson = (String) message.get("content"); // content는 JSON 형식의 문자열

            // contentJson을 다시 파싱하여 List<Map<String, String>> 형태로 변환
            return Optional.ofNullable(objectMapper.readValue(contentJson, new TypeReference<>() {
            }));
        } catch (Exception e) {
            throw new InternalServerException(BaseResponseStatus.CHATGPT_RESPONSE_ERROR);
        }
    }
}
