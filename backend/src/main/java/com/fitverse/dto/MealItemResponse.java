package com.fitverse.dto;

import java.math.BigDecimal;

public class MealItemResponse {

    private String id;
    private String foodId;
    private String foodName;
    private String mealCategory;
    private String logDate;
    private String servingLabel;
    private BigDecimal quantity;
    private BigDecimal totalGrams;
    private Integer calories;
    private BigDecimal protein;
    private BigDecimal carbs;
    private BigDecimal fat;
    private BigDecimal fibre;
    private String loggedAt;

    public MealItemResponse() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFoodId() { return foodId; }
    public void setFoodId(String foodId) { this.foodId = foodId; }

    public String getFoodName() { return foodName; }
    public void setFoodName(String foodName) { this.foodName = foodName; }

    public String getMealCategory() { return mealCategory; }
    public void setMealCategory(String mealCategory) { this.mealCategory = mealCategory; }

    public String getLogDate() { return logDate; }
    public void setLogDate(String logDate) { this.logDate = logDate; }

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

    public String getLoggedAt() { return loggedAt; }
    public void setLoggedAt(String loggedAt) { this.loggedAt = loggedAt; }
}
