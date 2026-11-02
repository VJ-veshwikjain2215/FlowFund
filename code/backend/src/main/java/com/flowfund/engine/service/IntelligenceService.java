package com.flowfund.engine.service;

import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class IntelligenceService {

    /**
     * ISSUE 8: Multi-Factor Risk Score (0.4*Vol + 0.2*Dep + 0.2*Conc + 0.2*Age)
     */
    public double calculateRiskScore(double vol, int dep, double conc, int age) {
        double ageFactor = age > 50 ? 0.8 : (age < 30 ? 1.0 : 0.6);
        double depFactor = Math.min(1.0, dep * 0.1); // 10 dependents = 1.0 risk contribution
        
        // Final Score (Clamped to 0.0-1.0)
        double score = (0.4 * Math.min(1.0, vol)) + (0.2 * depFactor) + (0.2 * Math.min(1.0, conc)) + (0.2 * ageFactor);
        return Math.min(1.0, score);
    }

    /**
     * ISSUE 7 (Edge Case): Quality of Life Score
     */
    public double calculateQoLScore(double savingsRatio, BigDecimal safeSpend, BigDecimal fixedExpenses) {
        double surplusFactor = (fixedExpenses.compareTo(BigDecimal.ZERO) > 0) ? 
            safeSpend.doubleValue() / fixedExpenses.doubleValue() : 0.0;
            
        // If savings > 60%, QoL drops. If safeSpend < 20% of expenses, QoL drops.
        double savingsPenalty = (savingsRatio > 0.6) ? (savingsRatio - 0.6) * 0.5 : 0;
        double surplusBonus = Math.min(1.0, surplusFactor);
        
        return Math.round(Math.max(0, (surplusBonus - savingsPenalty) * 100));
    }

    public double calculateHealthScore(double cv, double savingsRatio, double baseRisk, int age, int dependents) {
        double stability = 1.0 / (1.0 + Math.abs(cv));
        double clampedSavings = Math.min(1.0, Math.max(0, savingsRatio / 0.5));
        
        // Multi-Factor Risk Penalty
        double riskPenalty = 1.0 - baseRisk; 

        double total = (stability * 40) + (clampedSavings * 40) + (riskPenalty * 20);
        return Math.round(Math.min(100.0, total));
    }

    public List<String> generateSmartInsights(
            BigDecimal forecast,
            BigDecimal lastMonth,
            BigDecimal fixedExpenses,
            BigDecimal reserveFund,
            BigDecimal monthlyTargetBuffer,
            double confidence,
            boolean isCollapse
    ) {
        List<String> insights = new ArrayList<>();

        if (isCollapse) {
            insights.add("CRITICAL: Income Collapse Mode. Savings halted to prioritize immediate liquidity.");
        }

        if (fixedExpenses.compareTo(forecast.multiply(new BigDecimal("0.7"))) > 0) {
            insights.add("High Overhead Alert: Your fixed expenses are 70%+ of your projected inflow.");
        }

        if (confidence < 0.4) {
            insights.add("Data Inconsistency: Forecasting reliability is low due to recent erratic shifts.");
        }

        return insights;
    }
}
