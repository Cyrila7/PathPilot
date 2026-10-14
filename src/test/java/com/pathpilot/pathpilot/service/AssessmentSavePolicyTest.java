package com.pathpilot.pathpilot.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class AssessmentSavePolicyTest {
    private final String complete =
            "STATUS: ON TRACK\n" +
            "## 1. Top 3 Priorities Right Now\n" + "Apply to internships. ".repeat(12) + "\n" +
            "## 2. Skills to Learn First (Ordered by Priority)\n" + "Practice Java. ".repeat(12) + "\n" +
            "## 3. Timeline to First Internship\n" + "Plan applications. ".repeat(12) + "\n" +
            "## 4. Recommended Next Semester Courses\n" + "Confirm prerequisites. ".repeat(12);

    @Test
    void completeSuccessfulStreamCanSave() {
        assertTrue(AssessmentSavePolicy.canSave(complete, false));
    }

    @Test
    void incompleteAssessmentCannotSave() {
        assertFalse(AssessmentSavePolicy.canSave("STATUS: ON TRACK\n## 1. Top 3 Priorities Right Now", false));
    }

    @Test
    void failedStreamCannotSaveEvenWithCompleteText() {
        assertFalse(AssessmentSavePolicy.canSave(complete, true));
    }

    @Test
    void timedOutStreamCannotSave() {
        // A timeout sets the same failure flag as other streaming errors.
        boolean streamFailedAfterTimeout = true;
        assertFalse(AssessmentSavePolicy.canSave(complete, streamFailedAfterTimeout));
    }
}
