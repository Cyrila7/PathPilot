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
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.fasterxml.jackson.databind.ObjectMapper;
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
    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    @PostMapping("/{id}/ai-plan")
    public SseEmitter generateAiPlan(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader
    ) {
        SseEmitter emitter = new SseEmitter(120_000L);

        Student student = studentRepository.findById(id).orElse(null);
        if (student == null) {
            emitter.completeWithError(new RuntimeException("Student not found"));
            return emitter;
        }

        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractIdentifier(token);
        StringBuilder fullText = new StringBuilder();

        String prompt = buildPrompt(student);

        Map<String, Object> body = new HashMap<>();
        body.put("model", "claude-sonnet-4-6");
        body.put("max_tokens", 3500);
        body.put("stream", true);
        body.put("messages", List.of(Map.of("role", "user", "content", prompt)));

        webClient.post()
                .uri("https://api.anthropic.com/v1/messages")
                .header("x-api-key", API_KEY)
                .header("anthropic-version", "2023-06-01")
                .header("content-type", "application/json")
                .bodyValue(body)
                .retrieve()
                .bodyToFlux(String.class)
                .subscribe(
                    chunk -> {
                        try {
                            if (chunk.contains("content_block_delta")) {
                                String json = chunk.replace("data: ", "").trim();
                                Map<String, Object> chunkMap = new ObjectMapper().readValue(json, Map.class);
                                Map<String, Object> delta = (Map<String, Object>) chunkMap.get("delta");
                                String text = (String) delta.get("text");
                                if (text != null) {
                                    fullText.append(text);
                                    emitter.send(text);
                                }
                            }
                        } catch (Exception e) {
                            emitter.completeWithError(e);
                        }
                    },
                    error -> emitter.completeWithError(error),
                    () -> {
                        try {
                            String planText = fullText.toString();
                            if (!planText.contains("## 4.") || planText.length() < 400) {
                                emitter.completeWithError(new IllegalStateException("AI assessment incomplete; not saved."));
                                return;
                            }

                            // Parse status from first line
                            String status = "UNKNOWN";
                            for (String line : planText.split("\n")) {
                                if (line.trim().startsWith("STATUS:")) {
                                    status = line.replace("STATUS:", "").trim();
                                    break;
                                }
                            }

                            // Calculate score and persist to DB
                            int score = calculateScore(student);
                            planHistoryRepository.save(new PlanHistory(email, planText, status, score));

                            emitter.send("[DONE]");
                            emitter.complete();
                        } catch (Exception e) {
                            emitter.completeWithError(e);
                        }
                    }
                );

        return emitter;
    }

    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    // GET /students/me/plans
    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    @GetMapping("/me/plans")
    public List<PlanHistory> getMyPlans(
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractIdentifier(token);
        return planHistoryRepository.findByStudentEmailOrderByCreatedAtDesc(email);
    }

    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    // calculateScore() — deterministic, stored in DB on save
    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    // Academic 25, technical 30, experience 25, preparation 20.
    private int calculateScore(Student student) {
        int academic = 0;
        if (student.getGradeLevel() != null) academic += 5;
        if (student.getGpa() >= 2.0 && student.getGpa() <= 4.0) academic += 5;
        if (hasText(student.getDegreeWorksText())) academic += 15;
        int technical = 0;
        if (student.getSkillProfile() != null) {
            String level = student.getSkillProfile().getSkillLevel();
            if (level != null) {
                switch (level.trim().toLowerCase()) {
                    case "beginner": technical += 5; break;
                    case "intermediate": technical += 10; break;
                    case "strong": technical += 15; break;
                    default: break;
                }
            }
            if (hasText(student.getSkillProfile().getCurrentSkills())) technical += 10;
            if (hasText(student.getSkillProfile().getSkillGaps())) technical += 5;
        }
        // No structured project or internship evidence is currently stored.
        int experience = 0;
        int preparation = 0;
        if (student.getCareerGoal() != null) {
            if (hasText(student.getCareerGoal().getTargetRole())) preparation += 10;
            if (hasText(student.getCareerGoal().getTargetCompany())) preparation += 5;
            if (hasText(student.getCareerGoal().getTargetDate())) preparation += 5;
        }
        return Math.min(100, academic + technical + experience + preparation);
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank() && !value.equalsIgnoreCase("Not set");
    }

    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    // buildPrompt()
    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    private String buildPrompt(Student student) {

        String today = java.time.LocalDate.now().toString();

        String degreeAudit = student.getDegreeWorksText();
        if (degreeAudit != null && degreeAudit.length() > 9000) {
            degreeAudit = degreeAudit.substring(0, 9000) + "... [truncated]";
        }

        // Course facts are extracted before the AI sees the audit.
        // Unknown and alternative courses are not guaranteed requirements.
        String courseFacts = new com.pathpilot.pathpilot.service.DegreeWorksParser()
                .summarizeCourseStatuses(degreeAudit);

        String targetRole = student.getCareerGoal() != null
                ? student.getCareerGoal().getTargetRole() : "Not set";

        String targetCompany = student.getCareerGoal() != null
                ? student.getCareerGoal().getTargetCompany() : "Not set";

        String currentSkills = student.getSkillProfile() != null
                ? student.getSkillProfile().getCurrentSkills() : "Not set";

        String skillGaps = student.getSkillProfile() != null
                ? student.getSkillProfile().getSkillGaps() : "Not set";

        return String.format(
                "You are PathPilot — brutally honest career advisor for CS students targeting SWE internships. "
                + "No fluff. No encouragement for its own sake. Be specific to this student's actual situation and audit.\n\n"
                + "Today: %s\n"
                + "Student: %s | Major: %s at %s | Year: %s | GPA: %.2f\n"
                + "Parsed course statuses (use these ahead of guesses from raw text):\n%s\n"
                + "Degree Audit: %s\n"
                + "Target: %s at %s\n"
                + "Skills: %s | Profile: %s\n\n"
                + "Grade-level urgency rules (apply strictly):\n"
                + "- FRESHMAN/SOPHOMORE: build fundamentals, explore, no internship panic yet\n"
                + "- JUNIOR: limited runway — must be internship-ready this cycle\n"
                + "- SENIOR: almost no runway — apply aggressively now, have backup plans\n\n"
                + "First line must be exactly one of:\n"
                + "STATUS: BEHIND\n"
                + "STATUS: ON TRACK\n"
                + "STATUS: AHEAD\n"
                + "BEHIND = no internship + major skill gaps. ON TRACK = has projects or skills. AHEAD = internship + strong skills.\n\n"
                + "Output exactly these 4 sections. No intro. No outro. No filler sentences.\n\n"
                + "## 1. Top 3 Priorities Right Now\n"
                + "3 specific actions this student must do immediately. Name exact technologies, companies, "
                + "and deadlines where relevant. No generic advice.\n\n"
                + "## 2. Skills to Learn First (Ordered by Priority)\n"
                + "Order by what blocks the internship most. Be specific to their stack and target company. "
                + "Name exact topics, not just categories.\n\n"
                + "## 3. Timeline to First Internship\n"
                + "Month-by-month plan from today until first offer. Use only future recruiting cycles; do not claim exact deadlines without evidence. "
                + "End with one candid, constructive sentence about their biggest obstacle.\n\n"
                + "## 4. Recommended Next Semester Courses\\n"
                + "Today is %s. Name the next upcoming semester and year correctly. "
                + "Use the degree audit and parsed statuses to select at most 4 courses that are still needed and not in progress. "
                + "Never recommend completed courses. GRADE_RECORDED does not prove a passing grade. "
                + "Do not treat alternative courses or concentration tracks as individually mandatory. "
                + "Do not claim courses are offered or prerequisites met without evidence. "
                + "Output only a heading such as 'For Spring 2027:', then a compact Markdown table with columns "
                + "'Course | Requirement status'. Each row should contain the course code and official name, "
                + "and either 'Required' or 'Choose one' for alternatives. No career justifications or paragraphs. "
                + "End with exactly this note: 'Based on your DegreeWorks audit. Confirm prerequisites and availability with your academic advisor.' "
                + "If there are no verified courses, say that instead.\\n",
                today,
                student.getName(),
                student.getMajor(), student.getSchool(),
                student.getGradeLevel(), student.getGpa(),
                courseFacts, degreeAudit,
                targetRole, targetCompany,
                currentSkills, skillGaps,
                today
        );
    }
}