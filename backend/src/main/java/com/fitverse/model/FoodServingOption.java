package com.fitverse.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "food_serving_options")
public class FoodServingOption {

    @Id
    @Column(length = 64)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "food_id", nullable = false)
    @JsonIgnore
    private Food food;

    @Column(nullable = false, length = 120)
    private String label;

    @Column(nullable = false, precision = 6, scale = 1)
    private BigDecimal grams;

    @Column(name = "unit_name", nullable = false, length = 40)
    private String unitName;

    @Column(name = "is_gram_based")
    private Boolean isGramBased = false;

    public FoodServingOption() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Food getFood() { return food; }
    public void setFood(Food food) { this.food = food; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public BigDecimal getGrams() { return grams; }
    public void setGrams(BigDecimal grams) { this.grams = grams; }

    public String getUnitName() { return unitName; }
    public void setUnitName(String unitName) { this.unitName = unitName; }

    public Boolean getIsGramBased() { return isGramBased; }
    public void setIsGramBased(Boolean isGramBased) { this.isGramBased = isGramBased; }
}
