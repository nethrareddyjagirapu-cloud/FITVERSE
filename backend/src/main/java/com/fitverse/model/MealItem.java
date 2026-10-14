package com.fitverse.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "meal_items")
public class MealItem {

    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "user_id", nullable = false, length = 64)
    private String userId;

    @Column(name = "food_id", length = 64)
    private String foodId;

    @Column(name = "food_name", nullable = false, length = 150)
    private String foodName;

    @Column(name = "meal_category", nullable = false, length = 32)
    private String mealCategory; // BREAKFAST, LUNCH, SNACKS, DINNER

    @Column(name = "log_date", nullable = false, length = 20)
    private String logDate; // YYYY-MM-DD

    @Column(name = "serving_label", length = 120)
    private String servingLabel;

    @Column(nullable = false, precision = 6, scale = 1)
    private BigDecimal quantity;

    @Column(name = "total_grams", nullable = false, precision = 6, scale = 1)
    private BigDecimal totalGrams;

    @Column(nullable = false)
    private Integer calories;

    @Column(precision = 5, scale = 1, nullable = false)
    private BigDecimal protein;

    @Column(precision = 5, scale = 1, nullable = false)
    private BigDecimal carbs;

    @Column(precision = 5, scale = 1, nullable = false)
    private BigDecimal fat;

    @Column(precision = 5, scale = 1, nullable = false)
    private BigDecimal fibre;

    @Column(name = "logged_at", length = 20)
    private String loggedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public MealItem() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
