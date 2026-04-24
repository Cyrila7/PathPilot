package com.pathpilot.pathpilot;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.*;

@RestController
@RequestMapping("/students")
@CrossOrigin(origins = {
    "http://localhost:3000",
    "http://localhost:5173",
    "https://path-pilot-rho.vercel.app"
})
public class AiPlanController {

    // repository to fetch students from database
    private final StudentRepository studentRepository;

    // WebClient is our tool for making HTTP requests to external APIs
    private final WebClient webClient;

    // API key loaded from environment variable — never hardcode this
    @Value("${anthropic.api.key}")
    private String API_KEY;

    // constructor — Spring injects the repository, we create the WebClient once
    public AiPlanController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
        this.webClient = WebClient.create();
    }

    @PostMapping("/{id}/ai-plan")
    public String generateAiPlan(@PathVariable Long id) throws Exception {

        // Step 1 — find student in database by id
        Student student = studentRepository.findById(id).orElse(null);
        if (student == null) return "Student not found";

        // Step 2 — build the prompt from student's real data
        String prompt = buildPrompt(student);

        // Step 3 — build the request body Anthropic expects
        Map<String, Object> body = new HashMap<>();
        body.put("model", "claude-opus-4-5");
        body.put("max_tokens", 1024);
        body.put("messages", List.of(Map.of("role", "user", "content", prompt)));

        // Step 4 — send request to Anthropic API using WebClient
        String rawResponse = webClient
            .post()                                              // POST request
            .uri("https://api.anthropic.com/v1/messages")       // Anthropic endpoint
            .header("x-api-key", API_KEY)                       // auth
            .header("anthropic-version", "2023-06-01")          // API version
            .header("content-type", "application/json")         // sending JSON
            .bodyValue(body)                                     // attach the body
            .retrieve()                                          // send it
            .bodyToMono(String.class)                            // read response as String
            .block();                                            // wait for response

            // Step 5 — extract just the text from the response
            Map<String, Object> responseMap = new com.fasterxml.jackson.databind.ObjectMapper()
                .readValue(rawResponse, Map.class);
            List<Map> content = (List<Map>) responseMap.get("content");
            return content.get(0).get("text").toString();
    }

    // builds a personalized prompt from the student's profile
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
            - Status: %s
            - Target Role: %s at %s
            - Current Skills: %s
            - Skill Gaps: %s

            Important instruction:
            The student's grade determines their runway (time left before internships/full-time recruiting).
            - Freshman/Sophomore = long runway → prioritize exploration, fundamentals, and compounding skills.
            - Junior = limited runway → prioritize internships, recruiting readiness, and fast skill acquisition.
            - Senior = almost no runway → prioritize immediate employability, aggressive applications, and backup plans.

            Adjust urgency, tone, and priorities accordingly. Be harsher and more urgent when runway is short.

            Generate a brutally honest, personalized action plan.

            Format it as:
            1. Overall Assessment (clear, blunt evaluation of their situation)
            2. Top 3 Priorities Right Now (high-impact, no fluff)
            3. Skills to Learn First (ordered, practical, tied to target role)
            4. Timeline to First Internship (realistic, based on their grade/runway — include weeks/months and what must happen when)
            """,
            today,
            student.getName(),
            student.getMajor(),
            student.getSchool(),
            student.getGradeLevel(),
            student.getGpa(),
            student.getDegreeWorksText(),
            student.getStatus(),
            student.getCareerGoal() != null ? student.getCareerGoal().getTargetRole() : "Not set",
            student.getCareerGoal() != null ? student.getCareerGoal().getTargetCompany() : "Not set",
            student.getSkillProfile() != null ? student.getSkillProfile().getCurrentSkills() : "Not set",
            student.getSkillProfile() != null ? student.getSkillProfile().getSkillGaps() : "Not set"
        );
    }
}