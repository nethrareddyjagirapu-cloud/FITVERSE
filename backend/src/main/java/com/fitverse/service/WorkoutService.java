package com.fitverse.service;

import com.fitverse.dto.WorkoutSessionRequest;
import com.fitverse.model.Exercise;
import com.fitverse.model.WorkoutSession;
import com.fitverse.repository.ExerciseRepository;
import com.fitverse.repository.WorkoutSessionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class WorkoutService {

    private final ExerciseRepository exerciseRepository;
    private final WorkoutSessionRepository workoutSessionRepository;

    public WorkoutService(ExerciseRepository exerciseRepository, WorkoutSessionRepository workoutSessionRepository) {
        this.exerciseRepository = exerciseRepository;
        this.workoutSessionRepository = workoutSessionRepository;
    }

    @Transactional(readOnly = true)
    public List<Exercise> getAllExercises() {
        return exerciseRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Exercise> getExercisesByMuscle(String muscleGroup) {
        return exerciseRepository.findByMuscleGroup(muscleGroup);
    }

    @Transactional
    public WorkoutSession logWorkoutSession(String userId, WorkoutSessionRequest request) {
        WorkoutSession session = new WorkoutSession();
        session.setId("session-" + UUID.randomUUID().toString());
        session.setUserId(userId);
        session.setName(request.getName());
        session.setSessionDate(request.getSessionDate());
        session.setDurationMinutes(request.getDurationMinutes());
        session.setTotalVolumeKg(request.getTotalVolumeKg());
        session.setExercisesLogged(request.getExercisesLogged());
        session.setNotes(request.getNotes());
        session.setCreatedAt(LocalDateTime.now());

        return workoutSessionRepository.save(session);
    }

    @Transactional(readOnly = true)
    public List<WorkoutSession> getUserWorkoutHistory(String userId) {
        return workoutSessionRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
