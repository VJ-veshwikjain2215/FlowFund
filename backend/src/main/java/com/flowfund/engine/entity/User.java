package com.flowfund.engine.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Column(unique = true)
    private String email;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    private String provider;

    // Monthly Expenses
    private BigDecimal rent = BigDecimal.ZERO;
    private BigDecimal groceries = BigDecimal.ZERO;
    private BigDecimal utilities = BigDecimal.ZERO;
    private BigDecimal internet = BigDecimal.ZERO;
    private BigDecimal transport = BigDecimal.ZERO;
    private BigDecimal otherExpenses = BigDecimal.ZERO;

    private BigDecimal monthlyDebt = BigDecimal.ZERO; // EMI / Loan Repayments
    private BigDecimal inflationRate = new BigDecimal("0.06"); // 6% Default

    // Financial Profile
    private String profession;
    private String incomeType;
    private BigDecimal baseIncome = BigDecimal.ZERO;

    // Risk Multipliers
    private Integer age = 25;
    private Integer dependents = 0;
    
    private String taxRegime = "NEW"; // NEW vs OLD

    private Double incomeConcentration = 0.5; // 1.0 = Single Client Risk

    private boolean onboarded = false;
    private String role = "USER";

    public User() {}

    public User(Long id, String name, String email, String password, String provider, BigDecimal rent, BigDecimal groceries, BigDecimal utilities, BigDecimal internet, BigDecimal transport, BigDecimal monthlyDebt, BigDecimal inflationRate, String profession, String incomeType, BigDecimal baseIncome, Integer age, Integer dependents, String taxRegime, Double incomeConcentration, boolean onboarded, String role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.provider = provider;
        this.rent = rent;
        this.groceries = groceries;
        this.utilities = utilities;
        this.internet = internet;
        this.transport = transport;
        this.monthlyDebt = monthlyDebt;
        this.inflationRate = inflationRate;
        this.profession = profession;
        this.incomeType = incomeType;
        this.baseIncome = baseIncome;
        this.age = age;
        this.dependents = dependents;
        this.taxRegime = taxRegime;
        this.incomeConcentration = incomeConcentration;
        this.onboarded = onboarded;
        this.role = role;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }
    public BigDecimal getRent() { return rent != null ? rent : BigDecimal.ZERO; }
    public void setRent(BigDecimal rent) { this.rent = rent; }
    public BigDecimal getGroceries() { return groceries != null ? groceries : BigDecimal.ZERO; }
    public void setGroceries(BigDecimal groceries) { this.groceries = groceries; }
    public BigDecimal getUtilities() { return utilities != null ? utilities : BigDecimal.ZERO; }
    public void setUtilities(BigDecimal utilities) { this.utilities = utilities; }
    public BigDecimal getInternet() { return internet != null ? internet : BigDecimal.ZERO; }
    public void setInternet(BigDecimal internet) { this.internet = internet; }
    public BigDecimal getTransport() { return transport != null ? transport : BigDecimal.ZERO; }
    public void setTransport(BigDecimal transport) { this.transport = transport; }
    public BigDecimal getOtherExpenses() { return otherExpenses != null ? otherExpenses : BigDecimal.ZERO; }
    public void setOtherExpenses(BigDecimal otherExpenses) { this.otherExpenses = otherExpenses; }
    public BigDecimal getMonthlyDebt() { return monthlyDebt != null ? monthlyDebt : BigDecimal.ZERO; }
    public void setMonthlyDebt(BigDecimal monthlyDebt) { this.monthlyDebt = monthlyDebt; }
    public BigDecimal getInflationRate() { return inflationRate != null ? inflationRate : new BigDecimal("0.06"); }
    public void setInflationRate(BigDecimal inflationRate) { this.inflationRate = inflationRate; }
    public String getProfession() { return profession; }
    public void setProfession(String profession) { this.profession = profession; }
    public String getIncomeType() { return incomeType; }
    public void setIncomeType(String incomeType) { this.incomeType = incomeType; }
    public BigDecimal getBaseIncome() { return baseIncome != null ? baseIncome : BigDecimal.ZERO; }
    public void setBaseIncome(BigDecimal baseIncome) { this.baseIncome = baseIncome; }
    public Integer getAge() { return age != null ? age : 25; }
    public void setAge(Integer age) { this.age = age; }
    public Integer getDependents() { return dependents != null ? dependents : 0; }
    public void setDependents(Integer dependents) { this.dependents = dependents; }
    public String getTaxRegime() { return taxRegime != null ? taxRegime : "NEW"; }
    public void setTaxRegime(String taxRegime) { this.taxRegime = taxRegime; }
    public Double getIncomeConcentration() { return incomeConcentration != null ? incomeConcentration : 0.5; }
    public void setIncomeConcentration(Double incomeConcentration) { this.incomeConcentration = incomeConcentration; }
    public boolean isOnboarded() { return onboarded; }
    public void setOnboarded(boolean onboarded) { this.onboarded = onboarded; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
