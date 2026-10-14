package com.fitverse.controller;

import com.fitverse.dto.LogMealItemRequest;
import com.fitverse.dto.MealItemResponse;
import com.fitverse.dto.NutritionSummaryResponse;
import com.fitverse.model.Food;
import com.fitverse.security.UserPrincipal;
import com.fitverse.service.NutritionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/nutrition")
@Tag(name = "Nutrition", description = "Food catalogue, daily meal logging, and macro breakdown")
public class NutritionController {

    private final NutritionService nutritionService;

    public NutritionController(NutritionService nutritionService) {
        this.nutritionService = nutritionService;
    }

    @GetMapping("/foods")
    @Operation(summary = "Search or retrieve standard reference foods (Indian and global staples)")
    public ResponseEntity<List<Food>> getFoods(@RequestParam(required = false) String query) {
        List<Food> foods = nutritionService.searchFoods(query);
        return ResponseEntity.ok(foods);
    }

    @PostMapping("/log")
    @Operation(summary = "Log a meal item with serving size and automatic nutrition calculations")
    public ResponseEntity<MealItemResponse> logMeal(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody LogMealItemRequest request) {
        MealItemResponse response = nutritionService.logMealItem(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/daily")
    @Operation(summary = "Get daily nutrition summary and logged meals for a specific date")
    public ResponseEntity<NutritionSummaryResponse> getDailySummary(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) String date) {
        String logDate = (date != null && !date.trim().isEmpty()) ? date.trim() : LocalDate.now().toString();
        NutritionSummaryResponse summary = nutritionService.getDailyNutrition(principal.getId(), logDate);
        return ResponseEntity.ok(summary);
    }

    @DeleteMapping("/item/{id}")
    @Operation(summary = "Remove a logged meal item")
    public ResponseEntity<Map<String, String>> deleteMeal(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String id) {
        nutritionService.deleteMealItem(principal.getId(), id);
        return ResponseEntity.ok(Collections.singletonMap("message", "Meal item deleted successfully"));
    }
}
