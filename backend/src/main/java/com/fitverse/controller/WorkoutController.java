package com.fitverse.controller;

import com.fitverse.dto.WorkoutSessionRequest;
import com.fitverse.model.Exercise;
import com.fitverse.model.WorkoutSession;
import com.fitverse.security.UserPrincipal;
import com.fitverse.service.WorkoutService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workouts")
@Tag(name = "Workouts", description = "Exercise library and workout session logging")
public class WorkoutController {

    private final WorkoutService workoutService;

    public WorkoutController(WorkoutService workoutService) {
        this.workoutService = workoutService;
    }

    @GetMapping("/exercises")
    @Operation(summary = "Get list of exercises, optionally filtered by target muscle group")
    public ResponseEntity<List<Exercise>> getExercises(@RequestParam(required = false) String muscleGroup) {
        List<Exercise> exercises = (muscleGroup != null && !muscleGroup.trim().isEmpty())
                ? workoutService.getExercisesByMuscle(muscleGroup.trim())
                : workoutService.getAllExercises();
        return ResponseEntity.ok(exercises);
    }

    @PostMapping("/session")
    @Operation(summary = "Log a completed workout session")
    public ResponseEntity<WorkoutSession> logSession(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody WorkoutSessionRequest request) {
        WorkoutSession session = workoutService.logWorkoutSession(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(session);
    }

    @GetMapping("/history")
    @Operation(summary = "Retrieve user's workout session history ordered by date")
    public ResponseEntity<List<WorkoutSession>> getHistory(@AuthenticationPrincipal UserPrincipal principal) {
        List<WorkoutSession> history = workoutService.getUserWorkoutHistory(principal.getId());
        return ResponseEntity.ok(history);
    }
}
