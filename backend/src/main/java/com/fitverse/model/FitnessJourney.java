package com.fitverse.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "fitness_journeys")
public class FitnessJourney {

    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "user_id", nullable = false, length = 64)
    private String userId;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(name = "goal_type", nullable = false, length = 40)
    private String goalType;

    @Column(name = "starting_weight_kg", precision = 5, scale = 2, nullable = false)
    private BigDecimal startingWeightKg;

    @Column(name = "current_weight_kg", precision = 5, scale = 2, nullable = false)
    private BigDecimal currentWeightKg;

    @Column(name = "target_weight_kg", precision = 5, scale = 2)
    private BigDecimal targetWeightKg;

    @Column(name = "start_date", nullable = false, length = 30)
    private String startDate;

    @Column(name = "planned_end_date", nullable = false, length = 30)
    private String plannedEndDate;

    @Column(name = "actual_end_date", length = 30)
    private String actualEndDate;

    @Column(length = 30)
    private String status = "ACTIVE"; // ACTIVE, PAUSED, ENDED_EARLY, COMPLETED

    @Column(name = "target_workout_days_per_week")
    private Integer targetWorkoutDaysPerWeek = 4;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public FitnessJourney() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

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

    public String getActualEndDate() { return actualEndDate; }
    public void setActualEndDate(String actualEndDate) { this.actualEndDate = actualEndDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getTargetWorkoutDaysPerWeek() { return targetWorkoutDaysPerWeek; }
    public void setTargetWorkoutDaysPerWeek(Integer targetWorkoutDaysPerWeek) { this.targetWorkoutDaysPerWeek = targetWorkoutDaysPerWeek; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
