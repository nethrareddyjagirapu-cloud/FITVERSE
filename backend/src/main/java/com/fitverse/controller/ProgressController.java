package com.fitverse.controller;

import com.fitverse.dto.ProgressMeasurementRequest;
import com.fitverse.model.ProgressMeasurement;
import com.fitverse.security.UserPrincipal;
import com.fitverse.service.ProgressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
@Tag(name = "Progress", description = "Body metrics and weight progress history")
public class ProgressController {

    private final ProgressService progressService;

    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @GetMapping("/measurements")
    @Operation(summary = "Get user's recorded body measurements and weight logs")
    public ResponseEntity<List<ProgressMeasurement>> getMeasurements(@AuthenticationPrincipal UserPrincipal principal) {
        List<ProgressMeasurement> measurements = progressService.getMeasurements(principal.getId());
        return ResponseEntity.ok(measurements);
    }

    @PostMapping("/measurements")
    @Operation(summary = "Log new body measurements (weight, waist, chest, hips)")
    public ResponseEntity<ProgressMeasurement> logMeasurement(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ProgressMeasurementRequest request) {
        ProgressMeasurement measurement = progressService.logMeasurement(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(measurement);
    }
}
