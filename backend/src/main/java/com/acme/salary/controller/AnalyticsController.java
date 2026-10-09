package com.acme.salary.controller;

import com.acme.salary.dto.*;
import com.acme.salary.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardSummaryDto> getDashboardSummary() {
        return ResponseEntity.ok(analyticsService.getDashboardSummary());
    }

    @GetMapping("/parity")
    public ResponseEntity<PayParityDto> getPayParity() {
        return ResponseEntity.ok(analyticsService.getPayParity());
    }

    @PostMapping("/what-if")
    public ResponseEntity<WhatIfSimulationResponse> simulateWhatIf(@RequestBody WhatIfSimulationRequest request) {
        return ResponseEntity.ok(analyticsService.simulateWhatIf(request));
    }

    @GetMapping("/qna")
    public ResponseEntity<QnAResponseDto> getQuestionsAndAnswers() {
        return ResponseEntity.ok(analyticsService.getQuestionsAndAnswers());
    }
}
