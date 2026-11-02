package com.flowfund.engine.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "buffers")
public class Buffer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Monthly Allocations
    private BigDecimal taxBuffer = BigDecimal.ZERO;
    private BigDecimal medicalBuffer = BigDecimal.ZERO;
    private BigDecimal emergencyBuffer = BigDecimal.ZERO;
    private BigDecimal safeToSpend = BigDecimal.ZERO;
    
    // Cumulative Funds (Stateful tracked)
    private BigDecimal totalEmergencyFund = BigDecimal.ZERO;
    private BigDecimal totalMedicalFund = BigDecimal.ZERO;
    private BigDecimal totalTaxSaved = BigDecimal.ZERO;

    // Status Flags
    private String riskLevel = "STABLE"; 
    private Boolean isUnstable = false;
    private Boolean isDeficit = false;
    private Boolean runwayCompleted = false;
    
    private BigDecimal volatility = BigDecimal.ZERO;
    private Double score = 0.0; // Financial health score
    private BigDecimal forecast = BigDecimal.ZERO; // Current month projected income
    
    @ElementCollection
    @CollectionTable(name = "buffer_forecast_series", joinColumns = @JoinColumn(name = "buffer_id"))
    @Column(name = "forecast_amount")
    private List<BigDecimal> forecastSeries = new ArrayList<>();
    
    @ElementCollection
    @CollectionTable(name = "buffer_insights", joinColumns = @JoinColumn(name = "buffer_id"))
    @Column(name = "insight_text", length = 1000)
    private List<String> insights = new ArrayList<>();
    
    private LocalDateTime lastUpdated;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    public Buffer() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public BigDecimal getTaxBuffer() { return taxBuffer != null ? taxBuffer : BigDecimal.ZERO; }
    public void setTaxBuffer(BigDecimal val) { this.taxBuffer = val; }
    public BigDecimal getMedicalBuffer() { return medicalBuffer != null ? medicalBuffer : BigDecimal.ZERO; }
    public void setMedicalBuffer(BigDecimal val) { this.medicalBuffer = val; }
    public BigDecimal getEmergencyBuffer() { return emergencyBuffer != null ? emergencyBuffer : BigDecimal.ZERO; }
    public void setEmergencyBuffer(BigDecimal val) { this.emergencyBuffer = val; }
    public BigDecimal getSafeToSpend() { return safeToSpend != null ? safeToSpend : BigDecimal.ZERO; }
    public void setSafeToSpend(BigDecimal val) { this.safeToSpend = val; }
    public BigDecimal getTotalEmergencyFund() { return totalEmergencyFund != null ? totalEmergencyFund : BigDecimal.ZERO; }
    public void setTotalEmergencyFund(BigDecimal val) { this.totalEmergencyFund = val; }
    public BigDecimal getTotalMedicalFund() { return totalMedicalFund != null ? totalMedicalFund : BigDecimal.ZERO; }
    public void setTotalMedicalFund(BigDecimal val) { this.totalMedicalFund = val; }
    public BigDecimal getTotalTaxSaved() { return totalTaxSaved != null ? totalTaxSaved : BigDecimal.ZERO; }
    public void setTotalTaxSaved(BigDecimal val) { this.totalTaxSaved = val; }
    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String val) { this.riskLevel = val; }
    public Boolean getIsUnstable() { return isUnstable != null ? isUnstable : false; }
    public void setIsUnstable(Boolean val) { this.isUnstable = val; }
    public Boolean getIsDeficit() { return isDeficit != null ? isDeficit : false; }
    public void setIsDeficit(Boolean val) { this.isDeficit = val; }
    public Boolean getRunwayCompleted() { return runwayCompleted != null ? runwayCompleted : false; }
    public void setRunwayCompleted(Boolean val) { this.runwayCompleted = val; }
    public BigDecimal getVolatility() { return volatility != null ? volatility : BigDecimal.ZERO; }
    public void setVolatility(BigDecimal val) { this.volatility = val; }
    public Double getScore() { return score != null ? score : 0.0; }
    public void setScore(Double val) { this.score = val; }
    public BigDecimal getForecast() { return forecast != null ? forecast : BigDecimal.ZERO; }
    public void setForecast(BigDecimal val) { this.forecast = val; }
    public List<BigDecimal> getForecastSeries() { return forecastSeries; }
    public void setForecastSeries(List<BigDecimal> val) { this.forecastSeries = val; }
    public List<String> getInsights() { return insights; }
    public void setInsights(List<String> val) { this.insights = val; }
    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime val) { this.lastUpdated = val; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}