package com.flowfund.engine.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "tax_records")
public class Tax {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private BigDecimal annualIncome;
    private BigDecimal annualTax;
    private BigDecimal savedTax; // Track already saved tax
    private BigDecimal monthlyBuffer;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    public Tax() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public BigDecimal getAnnualIncome() { return annualIncome; }
    public void setAnnualIncome(BigDecimal annualIncome) { this.annualIncome = annualIncome; }
    public BigDecimal getAnnualTax() { return annualTax; }
    public void setAnnualTax(BigDecimal annualTax) { this.annualTax = annualTax; }
    public BigDecimal getSavedTax() { return savedTax; }
    public void setSavedTax(BigDecimal savedTax) { this.savedTax = savedTax; }
    public BigDecimal getMonthlyBuffer() { return monthlyBuffer; }
    public void setMonthlyBuffer(BigDecimal monthlyBuffer) { this.monthlyBuffer = monthlyBuffer; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}