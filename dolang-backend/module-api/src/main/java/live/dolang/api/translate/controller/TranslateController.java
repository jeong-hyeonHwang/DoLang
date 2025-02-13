package live.dolang.api.translate.controller;

import live.dolang.api.translate.service.TranslateService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import live.dolang.api.translate.dto.TranslateRequest;
import live.dolang.api.translate.dto.TranslateResponse;

@RestController
@RequestMapping("/api")
class TranslateController {

    private final TranslateService translateService;

    public TranslateController(TranslateService translateService) {
        this.translateService = translateService;
    }

    @PostMapping("/translate")
    public ResponseEntity<TranslateResponse> translate(@RequestBody TranslateRequest request) {
        return ResponseEntity.ok(translateService.translate(request));
    }
}