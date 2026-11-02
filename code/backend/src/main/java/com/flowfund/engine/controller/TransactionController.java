package com.flowfund.engine.controller;

import com.flowfund.engine.entity.Transaction;
import com.flowfund.engine.entity.User;
import com.flowfund.engine.repository.TransactionRepository;
import com.flowfund.engine.repository.UserRepository;
import com.flowfund.engine.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    @Autowired private TransactionService transactionService;
    @Autowired private TransactionRepository transactionRepo;
    @Autowired private UserRepository userRepo;

    @PostMapping("/upload")
    public String upload(@RequestParam MultipartFile file) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        transactionService.processCSV(file, email);
        return "Processing started asynchronously";
    }

    @PostMapping
    public Transaction add(@RequestBody Transaction t) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByEmail(email).orElseThrow();
        t.setUser(user);
        // Default to taxable if income
        if (t.getAmount() != null && t.getType() == null) {
            t.setType(t.getAmount().compareTo(java.math.BigDecimal.ZERO) > 0 ? "INCOME" : "EXPENSE");
            t.setIsTaxable(t.getAmount().compareTo(java.math.BigDecimal.ZERO) > 0);
        }
        return transactionRepo.save(t);
    }

    @GetMapping
    public List<Transaction> get() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByEmail(email).orElseThrow();
        return transactionRepo.findByUser(user);
    }
}
