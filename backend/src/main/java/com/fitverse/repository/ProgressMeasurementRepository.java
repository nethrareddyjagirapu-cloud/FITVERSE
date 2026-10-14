package com.fitverse.repository;

import com.fitverse.model.ProgressMeasurement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgressMeasurementRepository extends JpaRepository<ProgressMeasurement, String> {
    List<ProgressMeasurement> findByUserIdOrderByCreatedAtDesc(String userId);
}
