package com.pathpilot.pathpilot;

import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Embedded;


@Entity
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String major;
    private String school;
    private double gpa;
    private String degreeWorksText;

    @Embedded
    private CareerGoal careerGoal;

    @Embedded
    private SkillProfile skillProfile;

    @Enumerated(EnumType.STRING)
    private  GradeLevel gradeLevel;

    // JPA requires this
    public Student() {}
    

    public Student(String name, String email, String major, String school, double gpa, GradeLevel gradeLevel, String degreeWorksText) {
        this.name = name;
        this.email = email;
        this.major = major;
        this.school = school;
        this.gpa = gpa;
        this.gradeLevel = gradeLevel;
        this.degreeWorksText = degreeWorksText;
        this.careerGoal = new CareerGoal("Software Engineer", "Google", "2024-06-01");
        this.skillProfile = new SkillProfile("Intermediate");
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getMajor() { return major; }
    public String getSchool() { return school; }
    public double getGpa() { return gpa; }
    public String getDegreeWorksText() { return degreeWorksText; }
    public GradeLevel getGradeLevel() { return gradeLevel; }
    public CareerGoal getCareerGoal() { return careerGoal; }
    public SkillProfile getSkillProfile() { return skillProfile; }

    public String getStatus() {
        if (gpa >= 3.5) return "Ahead";
        else if (gpa >= 2.5) return "On Track";
        else return "Behind";
    }

    public void setName(String name) { this.name = name; }
    public void setMajor(String major) { this.major = major; }
    public void setSchool(String school) { this.school = school; }
    public void setEmail(String email) { this.email = email; }
    public void setGpa(double gpa) { this.gpa = gpa; }
    public void setDegreeWorksText(String degreeWorksText) { this.degreeWorksText = degreeWorksText; }
    public void setCareerGoal(CareerGoal careerGoal) { this.careerGoal = careerGoal; }
    public void setSkillProfile(SkillProfile skillProfile) { this.skillProfile = skillProfile; }
    public void setGradeLevel(GradeLevel gradeLevel) { this.gradeLevel = gradeLevel; }

        @Override
        public String toString() {
            return "Student{" +
                    "id=" + id +
                    ", name='" + name + '\'' +
                    ", email='" + email + '\'' +
                    ", major='" + major + '\'' +
                    ", school='" + school + '\'' +
                    ", gpa=" + gpa +
                    ", careerGoal=" + careerGoal +
                    ", skillProfile=" + skillProfile +
                    ", gradeLevel=" + gradeLevel +
                    '}';
        }
                    
}