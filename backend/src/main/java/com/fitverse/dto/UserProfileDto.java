package com.fitverse.dto;

import java.math.BigDecimal;

public class UserProfileDto {

    private Integer age;
    private String gender;
    private BigDecimal heightCm;
    private BigDecimal currentWeightKg;
    private String fitnessGoal;
    private String activityLevel;
    private String fitnessExperience;
    private String dietPreference;
    private String workoutLocation;
    private Integer preferredWorkoutDays;
    private String allergies;
    private Integer targetDailyCalories;
    private Integer targetDailyProtein;
    private Integer targetDailyCarbs;
    private Integer targetDailyFat;
    private Integer targetDailyFibre;

    public UserProfileDto() {}

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
}
