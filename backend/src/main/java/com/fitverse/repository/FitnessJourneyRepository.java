package com.fitverse.repository;

import com.fitverse.model.FitnessJourney;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FitnessJourneyRepository extends JpaRepository<FitnessJourney, String> {
    List<FitnessJourney> findByUserIdOrderByCreatedAtDesc(String userId);
}
