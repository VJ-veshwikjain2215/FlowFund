package com.flowfund.engine.controller;

import com.flowfund.engine.entity.User;
import com.flowfund.engine.repository.UserRepository;
import com.flowfund.engine.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired private UserRepository userRepository;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody com.flowfund.engine.dto.RegistrationRequest req) {
        if (req.getName() == null || req.getName().isBlank() || req.getEmail() == null ||
                !req.getEmail().matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$") ||
                req.getPassword() == null || req.getPassword().length() < 8 || req.getPassword().length() > 72) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "Enter a name, valid email and password of 8 to 72 characters");
        }
        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setProvider("LOCAL");
        
        User saved = userRepository.save(user);
        String token = jwtUtil.generateToken(user.getEmail());
        
        Map<String, Object> response = new java.util.HashMap<>();
        response.put("token", token);
        response.put("user", saved);
        return response;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> req) {
        String email = req.get("email");
        String rawPassword = req.get("password");
        User user = email == null ? null : userRepository.findByEmail(email).orElse(null);
        
        if (user == null || rawPassword == null || user.getPassword() == null || !passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }
        String token = jwtUtil.generateToken(user.getEmail());
        
        Map<String, Object> response = new java.util.HashMap<>();
        response.put("token", token);
        response.put("user", user);
        return response;
    }
}
