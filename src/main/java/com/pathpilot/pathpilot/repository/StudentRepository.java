package com.pathpilot.pathpilot.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pathpilot.pathpilot.model.Student;


public interface StudentRepository extends JpaRepository<Student, Long> {

}
