package com.flowfund.engine.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private LocalDate date;
    private String description;
    private BigDecimal amount;
    private String type; // INCOME / EXPENSE
    private Boolean isTaxable;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    public Transaction() {}

    public Transaction(Long id, LocalDate date, String description, BigDecimal amount, String type, Boolean isTaxable, User user) {
        this.id = id;
        this.date = date;
        this.description = description;
        this.amount = amount;
        this.type = type;
        this.isTaxable = isTaxable;
        this.user = user;
    }

    // Manual Builder
    public static TransactionBuilder builder() {
        return new TransactionBuilder();
    }

    public static class TransactionBuilder {
        private Long id;
        private LocalDate date;
        private String description;
        private BigDecimal amount;
        private String type;
        private Boolean isTaxable;
        private User user;

        public TransactionBuilder id(Long id) { this.id = id; return this; }
        public TransactionBuilder date(LocalDate date) { this.date = date; return this; }
        public TransactionBuilder description(String description) { this.description = description; return this; }
        public TransactionBuilder amount(BigDecimal amount) { this.amount = amount; return this; }
        public TransactionBuilder type(String type) { this.type = type; return this; }
        public TransactionBuilder isTaxable(Boolean isTaxable) { this.isTaxable = isTaxable; return this; }
        public TransactionBuilder user(User user) { this.user = user; return this; }

        public Transaction build() {
            return new Transaction(id, date, description, amount, type, isTaxable, user);
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Boolean getIsTaxable() { return isTaxable != null ? isTaxable : false; }
    public void setIsTaxable(Boolean isTaxable) { this.isTaxable = isTaxable; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
