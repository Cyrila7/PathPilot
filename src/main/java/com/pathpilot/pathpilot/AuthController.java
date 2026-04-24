package com.pathpilot.pathpilot;


import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private JwtUtil jwtUtil;

    public  AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }
 
    @PostMapping("/register")
    public String register(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return "User registered successfully";

    }

    @PostMapping("/login")
    public String login(@RequestBody User user) {
        Optional<User> optionalUser = userRepository.findByEmail(user.getEmail());
    if (optionalUser.isPresent()) {
        User existingUser = optionalUser.get();
        if (passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
            return jwtUtil.generateToken(existingUser.getEmail());
        }
    }
    return "Invalid credentials";
    }
}