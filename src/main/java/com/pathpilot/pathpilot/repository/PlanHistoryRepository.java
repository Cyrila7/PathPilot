package com.pathpilot.pathpilot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pathpilot.pathpilot.model.PlanHistory;
import java.util.List;

public interface PlanHistoryRepository extends JpaRepository<PlanHistory, Long> {
    List<PlanHistory> findByStudentEmailOrderByCreatedAtDesc(String studentEmail);
}