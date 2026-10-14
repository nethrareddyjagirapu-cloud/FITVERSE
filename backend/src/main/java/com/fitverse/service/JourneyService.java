package com.fitverse.service;

import com.fitverse.dto.JourneyRequest;
import com.fitverse.model.FitnessJourney;
import com.fitverse.repository.FitnessJourneyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class JourneyService {

    private final FitnessJourneyRepository journeyRepository;

    public JourneyService(FitnessJourneyRepository journeyRepository) {
        this.journeyRepository = journeyRepository;
    }

    @Transactional(readOnly = true)
    public List<FitnessJourney> getUserJourneys(String userId) {
        return journeyRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional
    public FitnessJourney startJourney(String userId, JourneyRequest request) {
        FitnessJourney journey = new FitnessJourney();
        journey.setId("jrn-" + UUID.randomUUID().toString());
        journey.setUserId(userId);
        journey.setName(request.getName());
        journey.setGoalType(request.getGoalType());
        journey.setStartingWeightKg(request.getStartingWeightKg());
        journey.setCurrentWeightKg(request.getCurrentWeightKg());
        journey.setTargetWeightKg(request.getTargetWeightKg());
        journey.setStartDate(request.getStartDate());
        journey.setPlannedEndDate(request.getPlannedEndDate());
        journey.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");
        journey.setTargetWorkoutDaysPerWeek(request.getTargetWorkoutDaysPerWeek());
        journey.setNotes(request.getNotes());
        journey.setCreatedAt(LocalDateTime.now());

        return journeyRepository.save(journey);
    }

    @Transactional
    public FitnessJourney updateJourneyStatus(String userId, String journeyId, String newStatus) {
        FitnessJourney journey = journeyRepository.findById(journeyId)
                .orElseThrow(() -> new IllegalArgumentException("Journey not found."));

        if (!journey.getUserId().equals(userId)) {
            throw new SecurityException("Unauthorized access to journey.");
        }

        journey.setStatus(newStatus);
        if ("COMPLETED".equalsIgnoreCase(newStatus) || "ENDED_EARLY".equalsIgnoreCase(newStatus)) {
            journey.setActualEndDate(LocalDateTime.now().toString().split("T")[0]);
        }

        return journeyRepository.save(journey);
    }
}
