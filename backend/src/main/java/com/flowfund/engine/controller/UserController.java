package com.flowfund.engine.controller;

import com.flowfund.engine.entity.User;
import com.flowfund.engine.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired private UserRepository userRepository;

    @GetMapping("/me")
    public User getMe(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping("/onboard")
    public User onboard(@RequestBody Map<String, Object> data, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (data.containsKey("profession")) user.setProfession((String) data.get("profession"));
        if (data.containsKey("incomeType")) user.setIncomeType((String) data.get("incomeType"));
        if (data.containsKey("baseIncome")) user.setBaseIncome(new java.math.BigDecimal(data.get("baseIncome").toString()));
        if (data.containsKey("rent")) user.setRent(new java.math.BigDecimal(data.get("rent").toString()));
        if (data.containsKey("groceries")) user.setGroceries(new java.math.BigDecimal(data.get("groceries").toString()));
        if (data.containsKey("utilities")) user.setUtilities(new java.math.BigDecimal(data.get("utilities").toString()));
        if (data.containsKey("internet")) user.setInternet(new java.math.BigDecimal(data.get("internet").toString()));
        if (data.containsKey("transport")) user.setTransport(new java.math.BigDecimal(data.get("transport").toString()));
        if (data.containsKey("otherExpenses")) user.setOtherExpenses(new java.math.BigDecimal(data.get("otherExpenses").toString()));
        if (data.containsKey("age")) user.setAge(Integer.parseInt(data.get("age").toString()));
        if (data.containsKey("dependents")) user.setDependents(Integer.parseInt(data.get("dependents").toString()));
        
        user.setOnboarded(true);
        return userRepository.save(user);
    }

    @PutMapping("/profile")
    public User updateProfile(@RequestBody Map<String, String> data, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        String newName = data.get("name");
        if (newName == null || newName.trim().isEmpty()) {
            throw new RuntimeException("Name cannot be empty");
        }
        
        user.setName(newName);
        return userRepository.save(user);
    }

    @PutMapping("/email")
    public User updateEmail(@RequestBody Map<String, String> data, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        String newEmail = data.get("email");
        if (newEmail == null || !newEmail.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new RuntimeException("Invalid email format");
        }
        
        if (userRepository.findByEmail(newEmail).isPresent() && !newEmail.equals(user.getEmail())) {
            throw new RuntimeException("Email already in use");
        }
        
        user.setEmail(newEmail);
        return userRepository.save(user);
    }
}
