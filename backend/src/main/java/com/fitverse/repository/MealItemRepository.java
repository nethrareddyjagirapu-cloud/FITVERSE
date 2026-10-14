package com.fitverse.repository;

import com.fitverse.model.MealItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MealItemRepository extends JpaRepository<MealItem, String> {
    List<MealItem> findByUserIdAndLogDateOrderByCreatedAtAsc(String userId, String logDate);
    List<MealItem> findByUserIdOrderByCreatedAtDesc(String userId);
}
