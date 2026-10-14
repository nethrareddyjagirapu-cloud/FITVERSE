package com.fitverse.dto;

import java.math.BigDecimal;
import java.util.List;

public class NutritionSummaryResponse {

    private String date;
    private Integer totalCalories;
    private BigDecimal totalProtein;
    private BigDecimal totalCarbs;
    private BigDecimal totalFat;
    private BigDecimal totalFibre;
    private Integer calorieTarget;
    private Integer caloriesRemaining;
    private List<MealItemResponse> items;

    public NutritionSummaryResponse() {}

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public Integer getTotalCalories() { return totalCalories; }
    public void setTotalCalories(Integer totalCalories) { this.totalCalories = totalCalories; }

    public BigDecimal getTotalProtein() { return totalProtein; }
    public void setTotalProtein(BigDecimal totalProtein) { this.totalProtein = totalProtein; }

    public BigDecimal getTotalCarbs() { return totalCarbs; }
    public void setTotalCarbs(BigDecimal totalCarbs) { this.totalCarbs = totalCarbs; }

    public BigDecimal getTotalFat() { return totalFat; }
    public void setTotalFat(BigDecimal totalFat) { this.totalFat = totalFat; }

    public BigDecimal getTotalFibre() { return totalFibre; }
    public void setTotalFibre(BigDecimal totalFibre) { this.totalFibre = totalFibre; }

    public Integer getCalorieTarget() { return calorieTarget; }
    public void setCalorieTarget(Integer calorieTarget) { this.calorieTarget = calorieTarget; }

    public Integer getCaloriesRemaining() { return caloriesRemaining; }
    public void setCaloriesRemaining(Integer caloriesRemaining) { this.caloriesRemaining = caloriesRemaining; }

    public List<MealItemResponse> getItems() { return items; }
    public void setItems(List<MealItemResponse> items) { this.items = items; }
}
