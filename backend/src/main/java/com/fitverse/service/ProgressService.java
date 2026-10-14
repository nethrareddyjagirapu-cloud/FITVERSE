package com.fitverse.service;

import com.fitverse.dto.ProgressMeasurementRequest;
import com.fitverse.model.ProgressMeasurement;
import com.fitverse.repository.ProgressMeasurementRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ProgressService {

    private final ProgressMeasurementRepository measurementRepository;

    public ProgressService(ProgressMeasurementRepository measurementRepository) {
        this.measurementRepository = measurementRepository;
    }

    @Transactional(readOnly = true)
    public List<ProgressMeasurement> getMeasurements(String userId) {
        return measurementRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional
    public ProgressMeasurement logMeasurement(String userId, ProgressMeasurementRequest request) {
        ProgressMeasurement m = new ProgressMeasurement();
        m.setId("m-" + UUID.randomUUID().toString());
        m.setUserId(userId);
        m.setMeasurementDate(request.getMeasurementDate());
        m.setWeightKg(request.getWeightKg());
        m.setWaistCm(request.getWaistCm());
        m.setChestCm(request.getChestCm());
        m.setHipCm(request.getHipCm());
        m.setNotes(request.getNotes());
        m.setCreatedAt(LocalDateTime.now());

        return measurementRepository.save(m);
    }
}
