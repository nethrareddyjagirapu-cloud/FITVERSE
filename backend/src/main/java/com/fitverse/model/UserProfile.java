package com.fitverse.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_profiles")
public class UserProfile {

    @Id
    @Column(length = 64)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private Integer age;

    @Column(length = 32)
    private String gender;

    @Column(name = "height_cm", precision = 5, scale = 2)
    private BigDecimal heightCm;

    @Column(name = "current_weight_kg", precision = 5, scale = 2)
    private BigDecimal currentWeightKg;

    @Column(name = "fitness_goal", length = 40)
    private String fitnessGoal;

    @Column(name = "activity_level", length = 40)
    private String activityLevel;

    @Column(name = "fitness_experience", length = 40)
    private String fitnessExperience;

    @Column(name = "diet_preference", length = 40)
    private String dietPreference;

    @Column(name = "workout_location", length = 40)
    private String workoutLocation;

    @Column(name = "preferred_workout_days")
    private Integer preferredWorkoutDays = 4;

    @Column(length = 255)
    private String allergies;

    @Column(name = "target_daily_calories")
    private Integer targetDailyCalories = 2200;

    @Column(name = "target_daily_protein")
    private Integer targetDailyProtein = 140;

    @Column(name = "target_daily_carbs")
    private Integer targetDailyCarbs = 250;

    @Column(name = "target_daily_fat")
    private Integer targetDailyFat = 65;

    @Column(name = "target_daily_fibre")
    private Integer targetDailyFibre = 35;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public UserProfile() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public BigDecimal getHeightCm() { return heightCm; }
    public void setHeightCm(BigDecimal heightCm) { this.heightCm = heightCm; }

    public BigDecimal getCurrentWeightKg() { return currentWeightKg; }
    public void setCurrentWeightKg(BigDecimal currentWeightKg) { this.currentWeightKg = currentWeightKg; }

    public String getFitnessGoal() { return fitnessGoal; }
    public void setFitnessGoal(String fitnessGoal) { this.fitnessGoal = fitnessGoal; }

    public String getActivityLevel() { return activityLevel; }
    public void setActivityLevel(String activityLevel) { this.activityLevel = activityLevel; }

    public String getFitnessExperience() { return fitnessExperience; }
    public void setFitnessExperience(String fitnessExperience) { this.fitnessExperience = fitnessExperience; }

    public String getDietPreference() { return dietPreference; }
    public void setDietPreference(String dietPreference) { this.dietPreference = dietPreference; }

    public String getWorkoutLocation() { return workoutLocation; }
    public void setWorkoutLocation(String workoutLocation) { this.workoutLocation = workoutLocation; }

    public Integer getPreferredWorkoutDays() { return preferredWorkoutDays; }
    public void setPreferredWorkoutDays(Integer preferredWorkoutDays) { this.preferredWorkoutDays = preferredWorkoutDays; }

    public String getAllergies() { return allergies; }
    public void setAllergies(String allergies) { this.allergies = allergies; }

    public Integer getTargetDailyCalories() { return targetDailyCalories; }
    public void setTargetDailyCalories(Integer targetDailyCalories) { this.targetDailyCalories = targetDailyCalories; }

    public Integer getTargetDailyProtein() { return targetDailyProtein; }
    public void setTargetDailyProtein(Integer targetDailyProtein) { this.targetDailyProtein = targetDailyProtein; }

    public Integer getTargetDailyCarbs() { return targetDailyCarbs; }
    public void setTargetDailyCarbs(Integer targetDailyCarbs) { this.targetDailyCarbs = targetDailyCarbs; }

    public Integer getTargetDailyFat() { return targetDailyFat; }
    public void setTargetDailyFat(Integer targetDailyFat) { this.targetDailyFat = targetDailyFat; }

    public Integer getTargetDailyFibre() { return targetDailyFibre; }
    public void setTargetDailyFibre(Integer targetDailyFibre) { this.targetDailyFibre = targetDailyFibre; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
