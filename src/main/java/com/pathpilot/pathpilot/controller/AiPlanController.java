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
        public SseEmitter generateAiPlan(           // ← SseEmitter return type
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
    StringBuilder fullText = new StringBuilder(); // accumulates all chunks

    String prompt = buildPrompt(student);

    Map<String, Object> body = new HashMap<>();
    body.put("model", "claude-sonnet-4-6");
    body.put("max_tokens", 2048);
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
                        // Each chunk looks like:
                        // data: {"type":"content_block_delta","delta":{"type":"text_delta","text":"Hello"}}
                        // You need to:
                        // 1. Check if chunk contains "content_block_delta"
                        // 2. Parse the JSON to extract the "text" value
                        // 3. Append text to fullText
                        // 4. Send text to frontend: emitter.send(text)
                        
                        // YOUR CODE HERE
                        if(chunk.contains("content_block_delta")) {
                            String json = chunk.replace("data: ", "").trim();
                            Map<String, Object> chunkMap = new ObjectMapper().readValue(json, Map.class);
                            Map<String, Object> delta = (Map<String, Object>) chunkMap.get("delta");
                            String text = (String) delta.get("text");
                            if(text != null) {
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
                        // Stream is done — fullText has the complete response
                        // 1. Parse STATUS from fullText (you already know how to do this)
                        // 2. Save to planHistoryRepository
                        // 3. Call emitter.complete()
                        
                        // YOUR CODE HERE
                        
                String planText = fullText.toString();
                String status = "UNKNOWN";
                for (String line : planText.split("\n")) {
                if (line.trim().startsWith("STATUS:")) {
                        status = line.replace("STATUS:", "").trim();
                        break;
                }
                }
                planHistoryRepository.save(new PlanHistory(email, planText, status));
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
        return planHistoryRepository
                .findByStudentEmailOrderByCreatedAtDesc(email);
    }

    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    // buildPrompt()
    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    private String buildPrompt(Student student) {

        String today = java.time.LocalDate.now().toString();

        String degreeAudit = student.getDegreeWorksText();
        if (degreeAudit != null && degreeAudit.length() > 800) {
            degreeAudit = degreeAudit.substring(0, 800) + "... [truncated]";
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
                + "Today: %s\n"
                + "Student: %s | Major: %s at %s | Year: %s | GPA: %.2f\n"
                + "Degree Audit: %s\n"
                + "Target: %s at %s\n"
                + "Skills: %s | Gaps: %s\n\n"
                + "Grade-level urgency rules (apply strictly):\n"
                + "- FRESHMAN/SOPHOMORE: build fundamentals, explore, no internship panic yet\n"
                + "- JUNIOR: limited runway — must be internship-ready this cycle\n"
                + "- SENIOR: almost no runway — apply aggressively now, have backup plans\n\n"
                + "First line must be exactly one of:\n"
                + "STATUS: BEHIND\n"
                + "STATUS: ON TRACK\n"
                + "STATUS: AHEAD\n"
                + "BEHIND = no internship + major skill gaps. ON TRACK = has projects or skills. AHEAD = internship + strong skills.\n\n"
                + "Output exactly these 4 sections. No intro. No outro.\n\n"
                + "## 1. Top 3 Priorities Right Now\n"
                + "3 specific actions the student must do immediately. Be direct.\n\n"
                + "## 2. Skills to Learn First (Ordered by Priority)\n"
                + "Order by what blocks the internship most. Be specific to their stack.\n\n"
                + "## 3. Timeline to First Internship\n"
                + "Month-by-month plan. End with one brutal honest sentence.\n\n"
                + "## 4. Recommended Next Semester Courses\n"
                + "Today is %s. Based on that, determine what semester is coming next "
                + "(e.g. if it's May/June -> Fall semester, if it's November/December -> Spring semester). "
                + "State the upcoming semester at the top of this section (e.g. 'For Fall 2026:'). "
                + "Read the degree audit above carefully. Identify required or core courses "
                + "that are NOT yet completed or in progress. Recommend the 3-4 highest priority "
                + "courses to take NEXT SEMESTER specifically — use the actual course names from "
                + "their program if visible in the audit. Explain why each one matters for their "
                + "internship goal, not just graduation.\n",
                today,
                student.getName(),
                student.getMajor(), student.getSchool(),
                student.getGradeLevel(), student.getGpa(),
                degreeAudit,
                targetRole, targetCompany,
                currentSkills, skillGaps,
                today
        );
    }
}