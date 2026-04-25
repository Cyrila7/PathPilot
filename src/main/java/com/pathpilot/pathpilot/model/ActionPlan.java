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

    public void addRecommendation(String rec) { recommendations.add(rec); }
    public void addPriorityCourse(String course) { priorityCourses.add(course); }
    public void addPrioritySkill(String skill) { prioritySkills.add(skill); }

    public ArrayList<String> getRecommendations() { return recommendations; }
    public ArrayList<String> getPriorityCourses() { return priorityCourses; }
    public ArrayList<String> getPrioritySkills() { return prioritySkills; }
    public String getGenerateDate() { return generateDate; }

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