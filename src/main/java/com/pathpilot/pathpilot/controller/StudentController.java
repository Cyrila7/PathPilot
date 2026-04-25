package com.pathpilot.pathpilot.controller;

import com.pathpilot.pathpilot.model.Student;
import com.pathpilot.pathpilot.repository.StudentRepository;
import com.pathpilot.pathpilot.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @GetMapping("/me")
    public ResponseEntity<Student> getMyProfile(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractIdentifier(token);
        return studentRepository.findTopByEmailOrderByIdDesc(email)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}
