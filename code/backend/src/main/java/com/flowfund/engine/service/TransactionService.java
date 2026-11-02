package com.flowfund.engine.service;

import com.flowfund.engine.entity.Transaction;
import com.flowfund.engine.entity.User;
import com.flowfund.engine.repository.TransactionRepository;
import com.flowfund.engine.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Locale;

@Service
public class TransactionService {
    @Autowired private TransactionRepository transactionRepo;
    @Autowired private UserRepository userRepo;

    @Transactional
    public void processCSV(MultipartFile file, String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        
        try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            br.readLine(); // Skip header
            String line;
            while ((line = br.readLine()) != null) {
                String[] data = line.split(",");
                if (data.length < 3) continue;

                LocalDate date = parseDate(data[0].trim());
                String description = data[1].trim();
                // Strip all non-numeric chars except decimal and sign
                BigDecimal amount = new BigDecimal(data[2].trim().replaceAll("[^\\d\\.-]", ""));

                if (!transactionRepo.existsByUserAndDateAndDescriptionAndAmount(user, date, description, amount)) {
                    Transaction t = Transaction.builder()
                        .date(date)
                        .description(description)
                        .amount(amount)
                        .type(amount.compareTo(BigDecimal.ZERO) > 0 ? "INCOME" : "EXPENSE")
                        .isTaxable(amount.compareTo(BigDecimal.ZERO) > 0)
                        .user(user)
                        .build();
                    transactionRepo.save(t);
                }
            }
            transactionRepo.flush();
        } catch (Exception e) {
            if (e.getMessage().contains("Unrecognized date pattern")) {
                throw new RuntimeException(e.getMessage());
            }
            throw new RuntimeException("CSV sync failed: " + e.getMessage());
        }
    }

    private LocalDate parseDate(String val) {
        String[] formats = {
            "yyyy-MM-dd", "dd/MM/yyyy", "MM/dd/yyyy", "yyyy/MM/dd", 
            "dd-MM-yyyy", "MMM dd, yyyy", "dd MMM yyyy", "dd-MMM-yyyy", "yyyy-MMM-dd"
        };
        for (String f : formats) {
            try {
                return LocalDate.parse(val, java.time.format.DateTimeFormatter.ofPattern(f, Locale.ENGLISH));
            } catch (Exception ignored) {}
        }
        try { return LocalDate.parse(val); } catch (Exception e) {
            throw new RuntimeException("Unrecognized date pattern: " + val);
        }
    }
}
