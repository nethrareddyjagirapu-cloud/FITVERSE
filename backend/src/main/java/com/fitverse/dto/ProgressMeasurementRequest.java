package com.fitverse.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class ProgressMeasurementRequest {

    @NotBlank(message = "Measurement date is required")
    private String measurementDate;

    @NotNull(message = "Weight is required")
    private BigDecimal weightKg;

    private BigDecimal waistCm;
    private BigDecimal chestCm;
    private BigDecimal hipCm;
    private String notes;

    public ProgressMeasurementRequest() {}

    public String getMeasurementDate() { return measurementDate; }
    public void setMeasurementDate(String measurementDate) { this.measurementDate = measurementDate; }

    public BigDecimal getWeightKg() { return weightKg; }
    public void setWeightKg(BigDecimal weightKg) { this.weightKg = weightKg; }

    public BigDecimal getWaistCm() { return waistCm; }
    public void setWaistCm(BigDecimal waistCm) { this.waistCm = waistCm; }

    public BigDecimal getChestCm() { return chestCm; }
    public void setChestCm(BigDecimal chestCm) { this.chestCm = chestCm; }

    public BigDecimal getHipCm() { return hipCm; }
    public void setHipCm(BigDecimal hipCm) { this.hipCm = hipCm; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
