package com.fitverse.dto;

import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;

public class WorkoutSessionRequest {

    @NotBlank(message = "Session name is required")
    private String name;

    @NotBlank(message = "Date is required")
    private String sessionDate;

    private Integer durationMinutes = 45;
    private BigDecimal totalVolumeKg = BigDecimal.ZERO;
    private Integer exercisesLogged = 1;
    private String notes;

    public WorkoutSessionRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSessionDate() { return sessionDate; }
    public void setSessionDate(String sessionDate) { this.sessionDate = sessionDate; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public BigDecimal getTotalVolumeKg() { return totalVolumeKg; }
    public void setTotalVolumeKg(BigDecimal totalVolumeKg) { this.totalVolumeKg = totalVolumeKg; }

    public Integer getExercisesLogged() { return exercisesLogged; }
    public void setExercisesLogged(Integer exercisesLogged) { this.exercisesLogged = exercisesLogged; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
