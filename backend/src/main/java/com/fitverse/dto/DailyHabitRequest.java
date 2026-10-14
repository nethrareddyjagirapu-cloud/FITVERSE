package com.fitverse.dto;

import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;

public class DailyHabitRequest {

    @NotBlank(message = "Log date is required")
    private String logDate;

    private Integer waterIntakeMl;
    private BigDecimal sleepHours;
    private Integer stepsCount;

    public DailyHabitRequest() {}

    public String getLogDate() { return logDate; }
    public void setLogDate(String logDate) { this.logDate = logDate; }

    public Integer getWaterIntakeMl() { return waterIntakeMl; }
    public void setWaterIntakeMl(Integer waterIntakeMl) { this.waterIntakeMl = waterIntakeMl; }

    public BigDecimal getSleepHours() { return sleepHours; }
    public void setSleepHours(BigDecimal sleepHours) { this.sleepHours = sleepHours; }

    public Integer getStepsCount() { return stepsCount; }
    public void setStepsCount(Integer stepsCount) { this.stepsCount = stepsCount; }
}
