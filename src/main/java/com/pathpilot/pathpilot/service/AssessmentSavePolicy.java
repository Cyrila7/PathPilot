package com.pathpilot.pathpilot.service;

/**
 * A generated assessment may be persisted only after a successful stream
 * and validation of its expected structure.
 */
public final class AssessmentSavePolicy {
    private AssessmentSavePolicy() {}

    public static boolean canSave(String assessment, boolean streamFailed) {
        return !streamFailed && AssessmentValidator.isValid(assessment);
    }
}
