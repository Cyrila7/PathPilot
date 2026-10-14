package com.pathpilot.pathpilot.service;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.HashMap;
import java.util.Map;

/**
 * Simple per-process safeguard for the public recruiter account.
 * Resets at midnight UTC or when the application restarts.
 */
public class DemoGenerationLimiter {
    private static final int DAILY_LIMIT = 5;
    private LocalDate day = LocalDate.now(ZoneOffset.UTC);
    private final Map<String, Integer> attempts = new HashMap<>();

    public synchronized boolean tryAcquire(String email) {
        if (!"demo@pathpilot.com".equalsIgnoreCase(email)) return true;
        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        if (!today.equals(day)) {
            attempts.clear();
            day = today;
        }
        String key = email.toLowerCase(java.util.Locale.ROOT);
        int used = attempts.getOrDefault(key, 0);
        if (used >= DAILY_LIMIT) return false;
        attempts.put(key, used + 1);
        return true;
    }
}
