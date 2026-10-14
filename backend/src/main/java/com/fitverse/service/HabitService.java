package com.fitverse.service;

import com.fitverse.dto.DailyHabitRequest;
import com.fitverse.model.DailyHabit;
import com.fitverse.repository.DailyHabitRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class HabitService {

    private final DailyHabitRepository habitRepository;

    public HabitService(DailyHabitRepository habitRepository) {
        this.habitRepository = habitRepository;
    }

    @Transactional(readOnly = true)
    public DailyHabit getHabits(String userId, String date) {
        return habitRepository.findByUserIdAndLogDate(userId, date)
                .orElseGet(() -> {
                    DailyHabit empty = new DailyHabit();
                    empty.setUserId(userId);
                    empty.setLogDate(date);
                    empty.setWaterIntakeMl(0);
                    empty.setSleepHours(BigDecimal.ZERO);
                    empty.setStepsCount(0);
                    return empty;
                });
    }

    @Transactional
    public DailyHabit saveHabit(String userId, DailyHabitRequest request) {
        DailyHabit habit = habitRepository.findByUserIdAndLogDate(userId, request.getLogDate())
                .orElseGet(() -> {
                    DailyHabit newHabit = new DailyHabit();
                    newHabit.setId("habit-" + UUID.randomUUID().toString());
                    newHabit.setUserId(userId);
                    newHabit.setLogDate(request.getLogDate());
                    return newHabit;
                });

        if (request.getWaterIntakeMl() != null) habit.setWaterIntakeMl(request.getWaterIntakeMl());
        if (request.getSleepHours() != null) habit.setSleepHours(request.getSleepHours());
        if (request.getStepsCount() != null) habit.setStepsCount(request.getStepsCount());
        habit.setUpdatedAt(LocalDateTime.now());

        return habitRepository.save(habit);
    }
}
