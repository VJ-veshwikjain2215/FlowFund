package com.flowfund.engine.repository;

import com.flowfund.engine.entity.Transaction;
import com.flowfund.engine.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUser(User user);
    List<Transaction> findByUserIdOrderByDateAsc(Long userId);
    void deleteByUser(User user);
    boolean existsByUserAndDateAndDescriptionAndAmount(User user, java.time.LocalDate date, String description, java.math.BigDecimal amount);
}
