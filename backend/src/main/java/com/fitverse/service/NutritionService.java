package com.fitverse.service;

import com.fitverse.dto.LogMealItemRequest;
import com.fitverse.dto.MealItemResponse;
import com.fitverse.dto.NutritionSummaryResponse;
import com.fitverse.model.Food;
import com.fitverse.model.MealItem;
import com.fitverse.model.UserProfile;
import com.fitverse.repository.FoodRepository;
import com.fitverse.repository.MealItemRepository;
import com.fitverse.repository.UserProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class NutritionService {

    private final FoodRepository foodRepository;
    private final MealItemRepository mealItemRepository;
    private final UserProfileRepository userProfileRepository;

    public NutritionService(
            FoodRepository foodRepository,
            MealItemRepository mealItemRepository,
            UserProfileRepository userProfileRepository) {
        this.foodRepository = foodRepository;
        this.mealItemRepository = mealItemRepository;
        this.userProfileRepository = userProfileRepository;
    }

    @Transactional(readOnly = true)
    public List<Food> getAllFoods() {
        return foodRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Food> searchFoods(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllFoods();
        }
        return foodRepository.searchFoods(query.trim());
    }

    @Transactional
    public MealItemResponse logMealItem(String userId, LogMealItemRequest request) {
        MealItem item = new MealItem();
        item.setId("meal-log-" + UUID.randomUUID().toString());
        item.setUserId(userId);
        item.setFoodId(request.getFoodId());
        item.setFoodName(request.getFoodName());
        item.setMealCategory(request.getMealCategory().toUpperCase());
        item.setLogDate(request.getLogDate());
        item.setServingLabel(request.getServingLabel());
        item.setQuantity(request.getQuantity());
        item.setTotalGrams(request.getTotalGrams());

        // Calculate nutrient snapshot from database food or fallback to request
        if (request.getFoodId() != null && foodRepository.existsById(request.getFoodId())) {
            Food food = foodRepository.findById(request.getFoodId()).get();
            BigDecimal grams = request.getTotalGrams();
            BigDecimal hundred = new BigDecimal("100");

            int calculatedCalories = food.getCaloriesPer100g() * grams.intValue() / 100;
            BigDecimal calculatedProtein = food.getProteinPer100g().multiply(grams).divide(hundred, 1, RoundingMode.HALF_UP);
            BigDecimal calculatedCarbs = food.getCarbsPer100g().multiply(grams).divide(hundred, 1, RoundingMode.HALF_UP);
            BigDecimal calculatedFat = food.getFatPer100g().multiply(grams).divide(hundred, 1, RoundingMode.HALF_UP);
            BigDecimal calculatedFibre = food.getFibrePer100g().multiply(grams).divide(hundred, 1, RoundingMode.HALF_UP);

            item.setCalories(calculatedCalories);
            item.setProtein(calculatedProtein);
            item.setCarbs(calculatedCarbs);
            item.setFat(calculatedFat);
            item.setFibre(calculatedFibre);
        } else {
            item.setCalories(request.getCalories());
            item.setProtein(request.getProtein() != null ? request.getProtein() : BigDecimal.ZERO);
            item.setCarbs(request.getCarbs() != null ? request.getCarbs() : BigDecimal.ZERO);
            item.setFat(request.getFat() != null ? request.getFat() : BigDecimal.ZERO);
            item.setFibre(request.getFibre() != null ? request.getFibre() : BigDecimal.ZERO);
        }

        item.setLoggedAt(LocalTime.now().format(DateTimeFormatter.ofPattern("hh:mm a")));
        item = mealItemRepository.save(item);
        return toDto(item);
    }

    @Transactional(readOnly = true)
    public NutritionSummaryResponse getDailyNutrition(String userId, String date) {
        List<MealItem> items = mealItemRepository.findByUserIdAndLogDateOrderByCreatedAtAsc(userId, date);

        int totalCalories = 0;
        BigDecimal totalProtein = BigDecimal.ZERO;
        BigDecimal totalCarbs = BigDecimal.ZERO;
        BigDecimal totalFat = BigDecimal.ZERO;
        BigDecimal totalFibre = BigDecimal.ZERO;

        for (MealItem item : items) {
            totalCalories += item.getCalories();
            totalProtein = totalProtein.add(item.getProtein());
            totalCarbs = totalCarbs.add(item.getCarbs());
            totalFat = totalFat.add(item.getFat());
            totalFibre = totalFibre.add(item.getFibre());
        }

        int targetCalories = 2200;
        UserProfile profile = userProfileRepository.findByUserId(userId).orElse(null);
        if (profile != null && profile.getTargetDailyCalories() != null) {
            targetCalories = profile.getTargetDailyCalories();
        }

        int remaining = Math.max(0, targetCalories - totalCalories);

        NutritionSummaryResponse response = new NutritionSummaryResponse();
        response.setDate(date);
        response.setTotalCalories(totalCalories);
        response.setTotalProtein(totalProtein.setScale(1, RoundingMode.HALF_UP));
        response.setTotalCarbs(totalCarbs.setScale(1, RoundingMode.HALF_UP));
        response.setTotalFat(totalFat.setScale(1, RoundingMode.HALF_UP));
        response.setTotalFibre(totalFibre.setScale(1, RoundingMode.HALF_UP));
        response.setCalorieTarget(targetCalories);
        response.setCaloriesRemaining(remaining);
        response.setItems(items.stream().map(this::toDto).collect(Collectors.toList()));
        return response;
    }

    @Transactional
    public void deleteMealItem(String userId, String mealItemId) {
        MealItem item = mealItemRepository.findById(mealItemId)
                .orElseThrow(() -> new IllegalArgumentException("Meal record not found."));

        if (!item.getUserId().equals(userId)) {
            throw new SecurityException("Unauthorized access to meal item.");
        }

        mealItemRepository.delete(item);
    }

    private MealItemResponse toDto(MealItem item) {
        MealItemResponse res = new MealItemResponse();
        res.setId(item.getId());
        res.setFoodId(item.getFoodId());
        res.setFoodName(item.getFoodName());
        res.setMealCategory(item.getMealCategory());
        res.setLogDate(item.getLogDate());
        res.setServingLabel(item.getServingLabel());
        res.setQuantity(item.getQuantity());
        res.setTotalGrams(item.getTotalGrams());
        res.setCalories(item.getCalories());
        res.setProtein(item.getProtein());
        res.setCarbs(item.getCarbs());
        res.setFat(item.getFat());
        res.setFibre(item.getFibre());
        res.setLoggedAt(item.getLoggedAt());
        return res;
    }
}
