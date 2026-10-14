package com.fitverse.controller;

import com.fitverse.dto.JourneyRequest;
import com.fitverse.model.FitnessJourney;
import com.fitverse.security.UserPrincipal;
import com.fitverse.service.JourneyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/journeys")
@Tag(name = "Fitness Journeys", description = "Goal milestones and long-term fitness transformation journeys")
public class JourneyController {

    private final JourneyService journeyService;

    public JourneyController(JourneyService journeyService) {
        this.journeyService = journeyService;
    }

    @GetMapping
    @Operation(summary = "Get all fitness journeys for the authenticated user")
    public ResponseEntity<List<FitnessJourney>> getJourneys(@AuthenticationPrincipal UserPrincipal principal) {
        List<FitnessJourney> journeys = journeyService.getUserJourneys(principal.getId());
        return ResponseEntity.ok(journeys);
    }

    @PostMapping
    @Operation(summary = "Start a new fitness transformation journey")
    public ResponseEntity<FitnessJourney> startJourney(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody JourneyRequest request) {
        FitnessJourney journey = journeyService.startJourney(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(journey);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update status of a fitness journey (e.g. ACTIVE, COMPLETED, PAUSED)")
    public ResponseEntity<FitnessJourney> updateStatus(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String id,
            @RequestParam String status) {
        FitnessJourney updated = journeyService.updateJourneyStatus(principal.getId(), id, status);
        return ResponseEntity.ok(updated);
    }
}
