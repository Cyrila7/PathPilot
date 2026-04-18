package com.pathpilot.pathpilot;

import jakarta.persistence.Embeddable;

@Embeddable
public class CareerGoal {
    private String targetRole;
    private String targetCompany;
    private String targetDate;
    private String status;

    public CareerGoal() {
        this.status = "Not Started";
    }

    public CareerGoal(String targetRole, String targetCompany, String targetDate) {
        this.targetRole = targetRole;
        this.targetCompany = targetCompany;
        this.targetDate = targetDate;
        this.status = "Not Started";
    }

    // Getters
    public String getTargetRole() { return targetRole; }
    public String getTargetCompany() { return targetCompany; }
    public String getTargetDate() { return targetDate; }
    public String getStatus() { return status; }

    // Setters with validation
    public void setStatus(String status) {
        if(!status.equals("Not Started") && !status.equals("In Progress") && !status.equals("Achieved")) {
            System.out.println("Status must be 'Not Started', 'In Progress', or 'Achieved'.");
            return;
        }
        this.status = status;
    }

    public void updateStatus( String newStatus) {
        setStatus(newStatus);
        System.out.println("Career goal status updated to: " + this.status);
    }

    @Override
    public String toString() {
        return "CareerGoal{" +
            "targetRole='" + targetRole + "'" +
            ", targetCompany='" + targetCompany + "'" +
            ", targetDate='" + targetDate + "'" +
            ", status='" + status + "'" +
            "}";    
}

}












