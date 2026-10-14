package com.fitverse.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class JourneyRequest {

    @NotBlank(message = "Journey name is required")
    private String name;

    @NotBlank(message = "Goal type is required")
    private String goalType;

    @NotNull(message = "Starting weight is required")
    private BigDecimal startingWeightKg;

    @NotNull(message = "Current weight is required")
    private BigDecimal currentWeightKg;

    private BigDecimal targetWeightKg;

    @NotBlank(message = "Start date is required")
    private String startDate;

    @NotBlank(message = "Planned end date is required")
    private String plannedEndDate;

    private String status = "ACTIVE";
    private Integer targetWorkoutDaysPerWeek = 4;
    private String notes;

    public JourneyRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getGoalType() { return goalType; }
    public void setGoalType(String goalType) { this.goalType = goalType; }

    public BigDecimal getStartingWeightKg() { return startingWeightKg; }
    public void setStartingWeightKg(BigDecimal startingWeightKg) { this.startingWeightKg = startingWeightKg; }

    public BigDecimal getCurrentWeightKg() { return currentWeightKg; }
    public void setCurrentWeightKg(BigDecimal currentWeightKg) { this.currentWeightKg = currentWeightKg; }

    public BigDecimal getTargetWeightKg() { return targetWeightKg; }
    public void setTargetWeightKg(BigDecimal targetWeightKg) { this.targetWeightKg = targetWeightKg; }

    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }

    public String getPlannedEndDate() { return plannedEndDate; }
    public void setPlannedEndDate(String plannedEndDate) { this.plannedEndDate = plannedEndDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getTargetWorkoutDaysPerWeek() { return targetWorkoutDaysPerWeek; }
    public void setTargetWorkoutDaysPerWeek(Integer targetWorkoutDaysPerWeek) { this.targetWorkoutDaysPerWeek = targetWorkoutDaysPerWeek; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
