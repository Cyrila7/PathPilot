package com.pathpilot.pathpilot.model;
import java.util.ArrayList;

public class ActionPlan {
  private ArrayList<String> recommendations;
  private ArrayList<String> priorityCourses;
  private ArrayList<String> prioritySkills;
  private String generateDate;

  public ActionPlan() {
    this.generateDate = java.time.LocalDate.now().toString();
    this.recommendations = new ArrayList<>();
    this.priorityCourses = new ArrayList<>();
    this.prioritySkills = new ArrayList<>();

  }

  public void addRecommendation(String rec) {
    recommendations.add(rec);
  }

  public void addPriorityCourse(String course) {
    priorityCourses.add(course);
  }

  public void addPrioritySkill(String skill) {
    prioritySkills.add(skill);
  }

    public void generate(Student student) {
        String status = student.getStatus();
        
        // add to recommendations list — not just print
        if (status.equals("Behind")) {
            addRecommendation("Focus on GPA improvement before job applications");
        } else if (status.equals("On Track")) {
            addRecommendation("Start applying to internships");
        } else if (status.equals("Ahead")) {
            addRecommendation("Apply to top companies now");
        }

        //add target role recommendation
        addRecommendation("Target role: " + 
            student.getCareerGoal().getTargetRole() + 
            " at " + 
            student.getCareerGoal().getTargetCompany());

        // add each skill gap as priority skill
        if (student.getSkillProfile().getSkillGaps() != null && 
        !student.getSkillProfile().getSkillGaps().isEmpty()) {
        addPrioritySkill(student.getSkillProfile().getSkillGaps());
}
    }
    public void display() {
        System.out.println("Action Plan (Generated on: " + generateDate + "):");
        System.out.println("Recommendations:");
        for (String rec : recommendations) {
            System.out.println("- " + rec);
        }
        System.out.println("Priority Courses:");
        for (String course : priorityCourses) {
            System.out.println("- " + course);
        }
        System.out.println("Priority Skills:");
        for (String skill : prioritySkills) {
            System.out.println("- " + skill);
        }
    }
    public ArrayList<String> getRecommendations() {
        return recommendations;
    }
    public ArrayList<String> getPriorityCourses() {
        return priorityCourses;
    }
    public ArrayList<String> getPrioritySkills() {
        return prioritySkills;
    }
    public String getGenerateDate() {
        return generateDate;
    }
    @Override
    public String toString() {
        return "ActionPlan{" +
                "recommendations=" + recommendations +
                ", priorityCourses=" + priorityCourses +
                ", prioritySkills=" + prioritySkills +
                ", generateDate='" + generateDate + '\'' +
                '}';
    }
}