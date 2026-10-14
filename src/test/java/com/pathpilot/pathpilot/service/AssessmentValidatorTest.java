package com.pathpilot.pathpilot.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class AssessmentValidatorTest {
    private final String validAssessment =
            "STATUS: ON TRACK\n" +
            "## 1. Top 3 Priorities Right Now\n" + "Apply to internships. ".repeat(12) + "\n" +
            "## 2. Skills to Learn First (Ordered by Priority)\n" + "Practice Java. ".repeat(12) + "\n" +
            "## 3. Timeline to First Internship\n" + "Plan applications. ".repeat(12) + "\n" +
            "## 4. Recommended Next Semester Courses\n" + "Confirm prerequisites. ".repeat(12);

    @Test
    void acceptsCompleteAssessment() {
        assertTrue(AssessmentValidator.isValid(validAssessment));
    }

    @Test
    void rejectsMissingSection() {
        assertFalse(AssessmentValidator.isValid(validAssessment.replace("## 3. Timeline to First Internship", "Timeline")));
    }

    @Test
    void rejectsInvalidStatus() {
        assertFalse(AssessmentValidator.isValid(validAssessment.replace("STATUS: ON TRACK", "STATUS: UNKNOWN")));
    }

    @Test
    void rejectsOutOfOrderSections() {
        String reordered = validAssessment.replace("## 1. Top 3 Priorities Right Now", "TEMP")
                .replace("## 2. Skills to Learn First (Ordered by Priority)", "## 1. Top 3 Priorities Right Now")
                .replace("TEMP", "## 2. Skills to Learn First (Ordered by Priority)");
        assertFalse(AssessmentValidator.isValid(reordered));
    }

    @Test
    void rejectsEmptyResponse() {
        assertFalse(AssessmentValidator.isValid(null));
        assertFalse(AssessmentValidator.isValid(""));
    }
}
