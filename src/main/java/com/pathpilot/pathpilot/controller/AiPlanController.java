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

    public AiPlanController(
            StudentRepository studentRepository,
            PlanHistoryRepository planHistoryRepository,
            JwtUtil jwtUtil
    ) {
        this.studentRepository = studentRepository;
        this.planHistoryRepository = planHistoryRepository;
        this.jwtUtil = jwtUtil;
        this.webClient = WebClient.create();
    }

    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    // POST /students/{id}/ai-plan
    // Generates a new AI career plan for the student
    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
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
        body.put("max_tokens", 2048);
        body.put("messages", List.of(
                Map.of("role", "user", "content", prompt)
        ));

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

        Map<String, Object> responseMap =
                new com.fasterxml.jackson.databind.ObjectMapper()
                        .readValue(rawResponse, Map.class);

        List<Map> content = (List<Map>) responseMap.get("content");
        String planText = content.get(0).get("text").toString();

        // Parse STATUS line from top of response
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

    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    // GET /students/me/plans
    // Returns all past plans for the logged-in student
    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    @GetMapping("/me/plans")
    public List<PlanHistory> getMyPlans(
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractIdentifier(token);

        return planHistoryRepository
                .findByStudentEmailOrderByCreatedAtDesc(email);
    }

    /* 
    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    // GET /students/me/jobs
    // Returns a matched job board URL based on the student's career goal.
    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    @GetMapping("/me/jobs")
    public Map<String, String> getMatchedJobs(
            @RequestHeader("Authorization") String authHeader
    ) {

        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractIdentifier(token);

        Student student = studentRepository.findByEmail(email).orElse(null);

        if (student == null || student.getCareerGoal() == null) {
            return Map.of(
                    "url", "https://www.newgrad-jobs.com/entry-level-jobs",
                    "label", "Browse All Entry-Level Jobs"
            );
        }

        String role = student.getCareerGoal().getTargetRole().toLowerCase();
        String url;
        String label;

        if (role.contains("software") || role.contains("swe")
                || role.contains("backend") || role.contains("frontend")) {

            url = "https://www.newgrad-jobs.com/entry-level-jobs/software-engineer-jobs";
            label = "Software Engineer Internships";

        } else if (role.contains("data analyst")) {

            url = "https://www.newgrad-jobs.com/entry-level-jobs/data-analyst";
            label = "Data Analyst Internships";

        } else if (role.contains("machine learning")
                || role.contains("ml") || role.contains("ai")) {

            url = "https://www.newgrad-jobs.com/entry-level-jobs";
            label = "AI/ML Internships";

        } else if (role.contains("cyber") || role.contains("security")) {

            url = "https://www.newgrad-jobs.com/entry-level-jobs/cyber-security";
            label = "Cybersecurity Internships";

        } else if (role.contains("product") || role.contains("pm")) {

            url = "https://www.newgrad-jobs.com/entry-level-jobs";
            label = "Product Management Internships";

        } else if (role.contains("data engineer")) {

            url = "https://www.newgrad-jobs.com/entry-level-jobs/data-analyst";
            label = "Data Engineer Internships";

        } else {

            url = "https://www.newgrad-jobs.com/entry-level-jobs";
            label = "Browse Entry-Level Jobs";
        }

        return Map.of("url", url, "label", label);
    }
        */
    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    // buildPrompt()
    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    private String buildPrompt(Student student) {

        String today = java.time.LocalDate.now().toString();

        String degreeAudit = student.getDegreeWorksText();
        if (degreeAudit != null && degreeAudit.length() > 300) {
            degreeAudit = degreeAudit.substring(0, 300) + "... [truncated]";
        }

        String targetRole = student.getCareerGoal() != null
                ? student.getCareerGoal().getTargetRole() : "Not set";

        String targetCompany = student.getCareerGoal() != null
                ? student.getCareerGoal().getTargetCompany() : "Not set";

        String currentSkills = student.getSkillProfile() != null
                ? student.getSkillProfile().getCurrentSkills() : "Not set";

        String skillGaps = student.getSkillProfile() != null
                ? student.getSkillProfile().getSkillGaps() : "Not set";

return String.format(
    "You are PathPilot — brutally honest career advisor. No fluff. Be specific.\n\n"
    + "Today: %s | Student: %s | %s at %s | %s | GPA: %.2f\n"
    + "Audit: %s\n"
    + "Target: %s at %s\n"
    + "Skills: %s | Gaps: %s\n\n"
    + "First line must be exactly: STATUS: BEHIND or STATUS: ON TRACK or STATUS: AHEAD\n"
    + "BEHIND = no internship + major gaps. ON TRACK = has projects/skills. AHEAD = internship + strong skills.\n\n"
    + "Output exactly these 4 sections, concise, no intro, no outro:\n"
    + "## 1. Top 3 Priorities Right Now\n"
    + "## 2. Skills to Learn First (Ordered by Priority)\n"
    + "## 3. Timeline to First Internship\n"
    + "## 4. Recommended Next Semester Courses\n"
    + "End section 3 with one brutal honest sentence.\n",
    today,
    student.getName(),
    student.getMajor(), student.getSchool(),
    student.getGradeLevel(), student.getGpa(),
    degreeAudit,
    targetRole, targetCompany,
    currentSkills, skillGaps
);
    }
}