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

    //adding score field to store the score of the plan
    private Integer score;

    public PlanHistory() {}

    public PlanHistory(String studentEmail, String planText, String status, Integer score) {
        this.studentEmail = studentEmail;
        this.planText = planText;
        this.status = status;
        this.createdAt = LocalDateTime.now();
        this.score = score; // Initialize score to the provided value
    }

    public Long getId() { return id; }
    public String getStudentEmail() { return studentEmail; }
    public String getPlanText() { return planText; }
    public Integer getScore() { return score; }
    public String getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setScore(Integer score) { this.score = score; }
}