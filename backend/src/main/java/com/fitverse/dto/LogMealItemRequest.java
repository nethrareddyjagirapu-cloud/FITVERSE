package com.fitverse.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public class LogMealItemRequest {

    private String foodId;

    @NotBlank(message = "Food name is required")
    private String foodName;

    @NotBlank(message = "Meal category is required")
    private String mealCategory; // BREAKFAST, LUNCH, SNACKS, DINNER

    @NotBlank(message = "Log date is required")
    private String logDate; // YYYY-MM-DD

    private String servingOptionId;
    private String servingLabel;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    private BigDecimal quantity;

    @NotNull(message = "Total grams is required")
    @Positive(message = "Total grams must be positive")
    private BigDecimal totalGrams;

    @NotNull(message = "Calories is required")
    private Integer calories;

    private BigDecimal protein;
    private BigDecimal carbs;
    private BigDecimal fat;
    private BigDecimal fibre;
    private String notes;

    public LogMealItemRequest() {}

    public String getFoodId() { return foodId; }
    public void setFoodId(String foodId) { this.foodId = foodId; }

    public String getFoodName() { return foodName; }
    public void setFoodName(String foodName) { this.foodName = foodName; }

    public String getMealCategory() { return mealCategory; }
    public void setMealCategory(String mealCategory) { this.mealCategory = mealCategory; }

    public String getLogDate() { return logDate; }
    public void setLogDate(String logDate) { this.logDate = logDate; }

    public String getServingOptionId() { return servingOptionId; }
    public void setServingOptionId(String servingOptionId) { this.servingOptionId = servingOptionId; }

    public String getServingLabel() { return servingLabel; }
    public void setServingLabel(String servingLabel) { this.servingLabel = servingLabel; }

    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }

    public BigDecimal getTotalGrams() { return totalGrams; }
    public void setTotalGrams(BigDecimal totalGrams) { this.totalGrams = totalGrams; }

    public Integer getCalories() { return calories; }
    public void setCalories(Integer calories) { this.calories = calories; }

    public BigDecimal getProtein() { return protein; }
    public void setProtein(BigDecimal protein) { this.protein = protein; }

    public BigDecimal getCarbs() { return carbs; }
    public void setCarbs(BigDecimal carbs) { this.carbs = carbs; }

    public BigDecimal getFat() { return fat; }
    public void setFat(BigDecimal fat) { this.fat = fat; }

    public BigDecimal getFibre() { return fibre; }
    public void setFibre(BigDecimal fibre) { this.fibre = fibre; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
