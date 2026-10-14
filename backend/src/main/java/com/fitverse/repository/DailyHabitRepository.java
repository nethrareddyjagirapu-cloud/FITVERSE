package com.fitverse.repository;

import com.fitverse.model.DailyHabit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DailyHabitRepository extends JpaRepository<DailyHabit, String> {
    Optional<DailyHabit> findByUserIdAndLogDate(String userId, String logDate);
}
