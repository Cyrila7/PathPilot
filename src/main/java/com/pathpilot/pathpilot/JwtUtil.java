package com.pathpilot.pathpilot;

import java.util.Date;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {
    private String secret = "pathpilot-super-secret-key-2024-secure";
    
    public String generateToken(String email) {
    return
    Jwts.builder()
    .setSubject(email) // Set the subject of the token
    .setIssuedAt(new Date()) // Set the issued at time
    .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 30)) // 30 minutes for expiration
    .signWith(Keys.hmacShaKeyFor(secret.getBytes())) // Sign the token with the secret key
    .compact(); // build it as a String

    }

    public String extractIdentifier(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(secret.getBytes())) // use same key to verify
                .build()
                .parseClaimsJws(token) // Parse the token
                .getBody() // get the data inside
                .getSubject(); // get the email 

    }

    public boolean isTokenValid(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(Keys.hmacShaKeyFor(secret.getBytes()))
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;

        }
    }
}
