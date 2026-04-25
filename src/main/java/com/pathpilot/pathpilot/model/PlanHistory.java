package com.pathpilot.pathpilot.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.LocalDateTime;

@Entity
public class PlanHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String studentEmail;

    @Column(columnDefinition = "TEXT")
    private String planText;

    private String status;

    private LocalDateTime createdAt;

    public PlanHistory() {}

    public PlanHistory(String studentEmail, String planText, String status) {
        this.studentEmail = studentEmail;
        this.planText = planText;
        this.status = status;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getStudentEmail() { return studentEmail; }
    public String getPlanText() { return planText; }
    public String getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}