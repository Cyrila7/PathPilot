package com.pathpilot.pathpilot.controller;

import org.springframework.web.bind.annotation.*;

import com.pathpilot.pathpilot.model.ActionPlan;
import com.pathpilot.pathpilot.model.Student;
import com.pathpilot.pathpilot.repository.StudentRepository;
import com.pathpilot.pathpilot.security.JwtUtil;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;



@RestController
@RequestMapping("/students")
@CrossOrigin(origins = {
    "http://localhost:3000",
    "http://localhost:5173",
    "https://path-pilot-rho.vercel.app"
})
public class StudentController {

    private final StudentRepository studentRepository;
    private final JwtUtil jwtUtil;


    public StudentController(StudentRepository studentRepository, JwtUtil jwtUtil) {
        this.studentRepository = studentRepository;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public List<Student> getStudents() {
        return studentRepository.findAll();
    }

    @PostMapping
    public Student createStudent(@RequestBody Student student) {
        return studentRepository.save(student);
    }

    @GetMapping("/{id}")
     public Optional<Student> getStudentById(@PathVariable Long id) {
      return studentRepository.findById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteStudent(@PathVariable Long id) {
        studentRepository.deleteById(id);
    }

    @PutMapping("/{id}")
    public Student updateStudent(@PathVariable Long id, @RequestBody Student updatedStudent) {
    return studentRepository.findById(id)
        .map(student -> {
            student.setName(updatedStudent.getName());
            student.setEmail(updatedStudent.getEmail());
            student.setMajor(updatedStudent.getMajor());
            student.setSchool(updatedStudent.getSchool());
            student.setGpa(updatedStudent.getGpa());
            student.setDegreeWorksText(updatedStudent.getDegreeWorksText());
            student.setGradeLevel(updatedStudent.getGradeLevel());
            return studentRepository.save(student);
        })
        .orElse(null);
    }

    @PostMapping("/{id}/plan")
    public ActionPlan generateActionPlan(@PathVariable Long id) {
        Student student = studentRepository.findById(id).orElse(null);
        if (student == null) return null;
        ActionPlan plan = new ActionPlan();
        plan.generate(student);
        return plan;
       
    }
    @GetMapping("/me")
    public ResponseEntity<Student> getMyProfile(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractIdentifier(token);
        return studentRepository.findTopByEmailOrderByIdDesc(email)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}
