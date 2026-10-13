package com.pathpilot.pathpilot.model;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Column;

@Embeddable
public class SkillProfile {

    private String skillLevel;
    @Column(columnDefinition = "TEXT")
    private String currentSkills;
    @Column(columnDefinition = "TEXT")
    private String skillGaps;

    public SkillProfile() {}

    public SkillProfile(String skillLevel) {
        this.skillLevel = skillLevel;
        this.currentSkills = "";
        this.skillGaps = "";
    }

    public String getSkillLevel() { return skillLevel; }
    public String getCurrentSkills() { return currentSkills; }
    public String getSkillGaps() { return skillGaps; }

    public void setSkillLevel(String skillLevel) { this.skillLevel = skillLevel; }
    public void setCurrentSkills(String currentSkills) { this.currentSkills = currentSkills; }
    public void setSkillGaps(String skillGaps) { this.skillGaps = skillGaps; }
}