package com.pathpilot.pathpilot.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import com.pathpilot.pathpilot.model.PlanHistory;
import com.pathpilot.pathpilot.model.Student;
import com.pathpilot.pathpilot.repository.PlanHistoryRepository;
import com.pathpilot.pathpilot.repository.StudentRepository;
import com.pathpilot.pathpilot.security.JwtUtil;

@RestController
@RequestMapping("/students")
@CrossOrigin(origins = {
    "http://localhost:3000",
    "http://localhost:5173",
    "https://path-pilot-rho.vercel.app"
})
public class AiPlanController {

    private final StudentRepository studentRepository;
    private final PlanHistoryRepository planHistoryRepository;
    private final JwtUtil jwtUtil;
    private final WebClient webClient;

    @Value("${anthropic.api.key}")
    private String API_KEY;

    public AiPlanController(StudentRepository studentRepository, PlanHistoryRepository planHistoryRepository, JwtUtil jwtUtil) {
        this.studentRepository = studentRepository;
        this.planHistoryRepository = planHistoryRepository;
        this.jwtUtil = jwtUtil;
        this.webClient = WebClient.create();
    }

    @PostMapping("/{id}/ai-plan")
    public String generateAiPlan(
        @PathVariable Long id,
        @RequestHeader("Authorization") String authHeader
    ) throws Exception {

        Student student = studentRepository.findById(id).orElse(null);
        if (student == null) return "Student not found";

        String prompt = buildPrompt(student);

        Map<String, Object> body = new HashMap<>();
        body.put("model", "claude-sonnet-4-6");
        body.put("max_tokens", 4096);
        body.put("messages", List.of(Map.of("role", "user", "content", prompt)));

        String rawResponse = webClient
            .post()
            .uri("https://api.anthropic.com/v1/messages")
            .header("x-api-key", API_KEY)
            .header("anthropic-version", "2023-06-01")
            .header("content-type", "application/json")
            .bodyValue(body)
            .retrieve()
            .bodyToMono(String.class)
            .block();

        Map<String, Object> responseMap = new com.fasterxml.jackson.databind.ObjectMapper()
            .readValue(rawResponse, Map.class);
        List<Map> content = (List<Map>) responseMap.get("content");
        String planText = content.get(0).get("text").toString();

        String status = "UNKNOWN";
        for (String line : planText.split("\n")) {
            if (line.trim().startsWith("STATUS:")) {
                status = line.replace("STATUS:", "").trim();
                break;
            }
        }

        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractIdentifier(token);
        planHistoryRepository.save(new PlanHistory(email, planText, status));

        return planText;
    }

    @GetMapping("/me/plans")
    public List<PlanHistory> getMyPlans(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractIdentifier(token);
        return planHistoryRepository.findByStudentEmailOrderByCreatedAtDesc(email);
    }

    private String buildPrompt(Student student) {
        String today = java.time.LocalDate.now().toString();

        return String.format("""
            You are PathPilot, a brutally honest career advisor for college students. No sugarcoating. No generic advice. Be direct, specific, and practical.

            Today's date is %s.

            Student Profile:
            - Name: %s
            - Major: %s
            - School: %s
            - Grade: %s
            - GPA: %.2f
            - Degree Works Text: %s
            - Target Role: %s at %s
            - Current Skills: %s
            - Skill Gaps: %s

            Important instruction:
            The student's grade determines their runway (time left before internships/full-time recruiting).
            - Freshman/Sophomore = long runway → prioritize exploration, fundamentals, and compounding skills.
            - Junior = limited runway → prioritize internships, recruiting readiness, and fast skill acquisition.
            - Senior = almost no runway → prioritize immediate employability, aggressive applications, and backup plans.

            Adjust urgency, tone, and priorities accordingly. Be harsher and more urgent when runway is short.

            At the very top of your response, before anything else, output exactly one of these three lines:
            STATUS: BEHIND
            STATUS: ON TRACK
            STATUS: AHEAD

            Base the status on:
            - BEHIND: No internship experience, no real projects, significant skill gaps, or aggressive timeline with low preparation
            - ON TRACK: Has projects or relevant skills, realistic timeline, making steady progress
            - AHEAD: Has multiple strong projects, internship experience, strong skills aligned to target role

            Then continue with the full assessment below it.

            Generate a brutally honest, personalized action plan.

            Format it as:
            ## 1. Overall Assessment
            ## 2. Top 3 Priorities Right Now
            ## 3. Skills to Learn First (Ordered by Priority)
            ## 4. Timeline to First Internship
            ## 5. Recommended Next Semester Courses
            ## Final Reality Check
            """,
            today,
            student.getName(),
            student.getMajor(),
            student.getSchool(),
            student.getGradeLevel(),
            student.getGpa(),
            student.getDegreeWorksText(),
            student.getCareerGoal() != null ? student.getCareerGoal().getTargetRole() : "Not set",
            student.getCareerGoal() != null ? student.getCareerGoal().getTargetCompany() : "Not set",
            student.getSkillProfile() != null ? student.getSkillProfile().getCurrentSkills() : "Not set",
            student.getSkillProfile() != null ? student.getSkillProfile().getSkillGaps() : "Not set"
        );
    }
}