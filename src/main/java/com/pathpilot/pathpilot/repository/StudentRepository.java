package com.pathpilot.pathpilot.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pathpilot.pathpilot.model.Student;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findTopByEmailOrderByIdDesc(String email);
    Optional<Student> findByEmail(String email);
}