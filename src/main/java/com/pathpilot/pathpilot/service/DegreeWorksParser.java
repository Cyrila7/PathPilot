package com.pathpilot.pathpilot.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Reads course statuses from pasted DegreeWorks text.
 * Does not verify prerequisites or graduation eligibility.
 */
public class DegreeWorksParser {

    private static final Pattern COURSE = Pattern.compile("^[A-Z]{2,5}\\s+\\d{4}[A-Z]{0,2}$");
    private static final Pattern GRADE = Pattern.compile("^(A[+-]?|B[+-]?|C[+-]?|D[+-]?|F|CR|P|IP)$");
    private static final Pattern CHOICE = Pattern.compile("^\\d+\\s+Courses?\\s+in\\s+(.+)$", Pattern.CASE_INSENSITIVE);

    public String getCourseStatus(String audit, String courseCode) {
        if (audit == null || courseCode == null) return "UNKNOWN";

        String target = courseCode.trim().replaceAll("\\s+", " ").toUpperCase(Locale.ROOT);
        if (!COURSE.matcher(target).matches()) return "UNKNOWN";

        String[] lines = audit.split("\\R");
        boolean stillNeeded = false;

        for (int i = 0; i < lines.length; i++) {
            String line = lines[i].trim();

            // Only treat a standalone course code as a taken course.
            if (!line.equalsIgnoreCase(target)) continue;

            // DegreeWorks shows: code, title, grade, credits, term.
            if (i + 2 < lines.length) {
                String grade = lines[i + 2].trim().toUpperCase(Locale.ROOT);
                if (GRADE.matcher(grade).matches()) {
                    if (grade.equals("IP")) return "IN_PROGRESS";
                    // A recorded grade is not necessarily a passing grade.
                    return grade.equals("F") ? "GRADE_RECORDED" : "GRADE_RECORDED";
                }
            }
        }

        // Requirements appear as: Still needed: then 1 Course in CST 2309
        for (int i = 0; i < lines.length - 1; i++) {
            if (!lines[i].trim().equalsIgnoreCase("Still needed:")) continue;

            String requirement = lines[i + 1].trim();
            Matcher matcher = CHOICE.matcher(requirement);
            if (!matcher.matches()) continue;

            String options = matcher.group(1).toUpperCase(Locale.ROOT);
            String[] tokens = options.split("\\s+");
            String prefix = "";
            List<String> codes = new ArrayList<>();

            for (int j = 0; j < tokens.length; j++) {
                String token = tokens[j].replaceAll("[,;]$", "");
                if (token.matches("[A-Z]{2,5}")) {
                    prefix = token;
                } else if (token.matches("\\d{4}[A-Z]{0,2}") && !prefix.isEmpty()) {
                    codes.add(prefix + " " + token);
                }
            }

            if (codes.contains(target)) {
                // An option is not the same as an individually mandatory course.
                return codes.size() == 1 ? "STILL_NEEDED" : "REQUIREMENT_OPTION";
            }
        }
        return stillNeeded ? "STILL_NEEDED" : "UNKNOWN";
    }
}
