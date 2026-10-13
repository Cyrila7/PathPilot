package com.pathpilot.pathpilot.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

class DegreeWorksParserTest {
    private final DegreeWorksParser parser = new DegreeWorksParser();

    private final String audit = """
        CST 1204
        Database Systems Fundamentals
        A
        3
        SPRING 2026
        MAT 2440
        Data Structures and Algorithms
        IP
        (3)
        FALL 2026
        CST 4900
        Internship in Computer Systems
        A
        3
        SUMMER 2026
        Web Programming I Not complete
        Still needed:
        1 Course in CST 2309
        Discrete Structures and Algorithms II Not complete
        Still needed:
        1 Course in MAT 2540 or 1475
        Project Management Not complete
        Still needed:
        1 Course in CST 4800
        """;

    @Test
    void identifiesTakenAndInProgressCourses() {
        assertEquals("GRADE_RECORDED", parser.getCourseStatus(audit, "CST 1204"));
        assertEquals("IN_PROGRESS", parser.getCourseStatus(audit, "MAT 2440"));
        assertEquals("GRADE_RECORDED", parser.getCourseStatus(audit, "CST 4900"));
    }

    @Test
    void distinguishesRequirementsFromOptions() {
        assertEquals("STILL_NEEDED", parser.getCourseStatus(audit, "CST 2309"));
        assertEquals("STILL_NEEDED", parser.getCourseStatus(audit, "CST 4800"));
        assertEquals("REQUIREMENT_OPTION", parser.getCourseStatus(audit, "MAT 2540"));
        assertEquals("REQUIREMENT_OPTION", parser.getCourseStatus(audit, "MAT 1475"));
    }

    @Test
    void unknownCoursesStayUnknown() {
        assertEquals("UNKNOWN", parser.getCourseStatus(audit, "CST 9999"));
        assertEquals("UNKNOWN", parser.getCourseStatus("", "CST 2309"));
    }
}
