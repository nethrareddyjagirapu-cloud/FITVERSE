package com.fitverse.controller;

import com.fitverse.dto.DailyHabitRequest;
import com.fitverse.model.DailyHabit;
import com.fitverse.security.UserPrincipal;
import com.fitverse.service.HabitService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/habits")
@Tag(name = "Daily Habits", description = "Water intake, sleep duration, and step counts")
public class HabitController {

    private final HabitService habitService;

    public HabitController(HabitService habitService) {
        this.habitService = habitService;
    }

    @GetMapping
    @Operation(summary = "Get daily habit records for a specific date (water, sleep, steps)")
    public ResponseEntity<DailyHabit> getHabits(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) String date) {
        String logDate = (date != null && !date.trim().isEmpty()) ? date.trim() : LocalDate.now().toString();
        DailyHabit habit = habitService.getHabits(principal.getId(), logDate);
        return ResponseEntity.ok(habit);
    }

    @PostMapping
    @Operation(summary = "Log or update daily habit metrics")
    public ResponseEntity<DailyHabit> saveHabits(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody DailyHabitRequest request) {
        if (request.getLogDate() == null || request.getLogDate().trim().isEmpty()) {
            request.setLogDate(LocalDate.now().toString());
        }
        DailyHabit habit = habitService.saveHabit(principal.getId(), request);
        return ResponseEntity.ok(habit);
    }
}
