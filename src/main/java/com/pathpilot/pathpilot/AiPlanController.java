package com.pathpilot.pathpilot;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@RestController
@RequestMapping("/students")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "https://path-pilot-jl6rh9agp-cyrils-projects-65843490.vercel.app"})
public class AiPlanController {
    private final StudentRepository studentRepository;
    private final String API_KEY = System.getenv("ANTHROPIC_API_KEY");

    public AiPlanController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @PostMapping("/{id}/ai-plan")
    public String generateAiPlan(@PathVariable Long id) {
        Student student = studentRepository.findById(id).orElse(null);
        if(student == null) return "Student not found";


        String prompt = buildPrompt(student);

        // BUILD REQUEST BODY
        Map<String, Object> body = new HashMap<>();
        body.put("model", "claude-opus-4-5");
        body.put("max_tokens", 1024);
        body.put("messages", List.of(Map.of("role", "user", "content", prompt)
        ));

        // send request to Anthropic API
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-api-key", API_KEY);
        headers.set("anthropic-version", "2023-06-01");
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(
            "https://api.anthropic.com/v1/messages",
            request,
            Map.class
        );
        
        // Extract text from response
        List<Map> content = (List<Map>) response.getBody().get("content");
        return content.get(0).get("text").toString();
    }

    private String buildPrompt(Student student) {
        return String.format("""
            You are PathPilot, an honest career advisor for college students. No sugarcoating.
            
            Student Profile:
            - Name: %s
            - Major: %s
            - School: %s
            - GPA: %.2f
            - Status: %s
            - Target Role: %s at %s
            - Current Skills: %s
            - Skill Gaps: %s
            
            Generate a brutally honest, personalized action plan. Be specific. Be direct.
            Format it as:
            1. Overall Assessment
            2. Top 3 Priorities Right Now
            3. Skills to Learn First
            4. Timeline to first internship
            """,
            student.getName(),
            student.getMajor(),
            student.getSchool(),
            student.getGpa(),
            student.getStatus(),
            student.getCareerGoal() != null ? student.getCareerGoal().getTargetRole() : "Not set",
            student.getCareerGoal() != null ? student.getCareerGoal().getTargetCompany() : "Not set",
            student.getSkillProfile() != null ? student.getSkillProfile().getCurrentSkills() : "Not set",
            student.getSkillProfile() != null ? student.getSkillProfile().getSkillGaps() : "Not set"
        );
    }
}