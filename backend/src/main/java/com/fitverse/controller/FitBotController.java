package com.fitverse.controller;

import com.fitverse.dto.ChatRequest;
import com.fitverse.dto.ChatResponse;
import com.fitverse.security.UserPrincipal;
import com.fitverse.service.FitBotService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/fitbot")
@Tag(name = "FitBot AI", description = "FitBot interactive assistant for training and diet coaching")
public class FitBotController {

    private final FitBotService fitBotService;

    public FitBotController(FitBotService fitBotService) {
        this.fitBotService = fitBotService;
    }

    @PostMapping("/chat")
    @Operation(summary = "Ask FitBot a question about nutrition, workouts, and fitness")
    public ResponseEntity<ChatResponse> chat(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ChatRequest request) {
        String userId = (principal != null) ? principal.getId() : "guest";
        ChatResponse response = fitBotService.generateResponse(userId, request.getQuery());
        return ResponseEntity.ok(response);
    }
}
