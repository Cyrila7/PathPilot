package com.pathpilot.pathpilot.service;

import java.util.regex.Pattern;

public final class AssessmentValidator {
    private AssessmentValidator() {}

    private static final Pattern STATUS = Pattern.compile("(?m)^STATUS: (BEHIND|ON TRACK|AHEAD)\\s*$");
    private static final String[] HEADINGS = {
        "## 1. Top 3 Priorities Right Now",
        "## 2. Skills to Learn First (Ordered by Priority)",
        "## 3. Timeline to First Internship",
        "## 4. Recommended Next Semester Courses"
    };

    public static boolean isValid(String assessment) {
        if (assessment == null || assessment.isBlank() || assessment.length() < 400) return false;
        if (!STATUS.matcher(assessment).find()) return false;
        int previous = -1;
        for (String heading : HEADINGS) {
            int position = assessment.indexOf(heading);
            if (position <= previous) return false;
            previous = position;
        }
        return true;
    }
}
