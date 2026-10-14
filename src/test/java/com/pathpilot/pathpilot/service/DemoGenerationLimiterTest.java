package com.pathpilot.pathpilot.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class DemoGenerationLimiterTest {
    @Test
    void demoAccountGetsFiveAttempts() {
        DemoGenerationLimiter limiter = new DemoGenerationLimiter();
        for (int i = 0; i < 5; i++) {
            assertTrue(limiter.tryAcquire("demo@pathpilot.com"));
        }
        assertFalse(limiter.tryAcquire("demo@pathpilot.com"));
    }

    @Test
    void regularAccountsAreNotLimited() {
        DemoGenerationLimiter limiter = new DemoGenerationLimiter();
        for (int i = 0; i < 10; i++) {
            assertTrue(limiter.tryAcquire("student@example.com"));
        }
    }
}
