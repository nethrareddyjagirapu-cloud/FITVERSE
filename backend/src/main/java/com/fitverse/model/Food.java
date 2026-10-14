package com.fitverse.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "foods")
public class Food {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "hindi_name", length = 150)
    private String hindiName;

    @Column(nullable = false, length = 60)
    private String category;

    @Column(name = "calories_per_100g", nullable = false)
    private Integer caloriesPer100g;

    @Column(name = "protein_per_100g", precision = 5, scale = 1, nullable = false)
    private BigDecimal proteinPer100g;

    @Column(name = "carbs_per_100g", precision = 5, scale = 1, nullable = false)
    private BigDecimal carbsPer100g;

    @Column(name = "fat_per_100g", precision = 5, scale = 1, nullable = false)
    private BigDecimal fatPer100g;

    @Column(name = "fibre_per_100g", precision = 5, scale = 1, nullable = false)
    private BigDecimal fibrePer100g;

    @Column(name = "is_verified")
    private Boolean isVerified = true;

    @Column(length = 500)
    private String description;

    @Column(name = "created_by_user_id", length = 64)
    private String createdByUserId;

    @OneToMany(mappedBy = "food", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<FoodServingOption> servingOptions = new ArrayList<>();

    public Food() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getHindiName() { return hindiName; }
    public void setHindiName(String hindiName) { this.hindiName = hindiName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getCaloriesPer100g() { return caloriesPer100g; }
    public void setCaloriesPer100g(Integer caloriesPer100g) { this.caloriesPer100g = caloriesPer100g; }

    public BigDecimal getProteinPer100g() { return proteinPer100g; }
    public void setProteinPer100g(BigDecimal proteinPer100g) { this.proteinPer100g = proteinPer100g; }

    public BigDecimal getCarbsPer100g() { return carbsPer100g; }
    public void setCarbsPer100g(BigDecimal carbsPer100g) { this.carbsPer100g = carbsPer100g; }

    public BigDecimal getFatPer100g() { return fatPer100g; }
    public void setFatPer100g(BigDecimal fatPer100g) { this.fatPer100g = fatPer100g; }

    public BigDecimal getFibrePer100g() { return fibrePer100g; }
    public void setFibrePer100g(BigDecimal fibrePer100g) { this.fibrePer100g = fibrePer100g; }

    public Boolean getIsVerified() { return isVerified; }
    public void setIsVerified(Boolean isVerified) { this.isVerified = isVerified; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCreatedByUserId() { return createdByUserId; }
    public void setCreatedByUserId(String createdByUserId) { this.createdByUserId = createdByUserId; }

    public List<FoodServingOption> getServingOptions() { return servingOptions; }
    public void setServingOptions(List<FoodServingOption> servingOptions) { this.servingOptions = servingOptions; }
}
