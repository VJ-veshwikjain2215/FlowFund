package com.flowfund.engine.service;

import com.flowfund.engine.entity.Buffer;
import com.flowfund.engine.entity.User;
import com.flowfund.engine.entity.Transaction;
import com.flowfund.engine.repository.BufferRepository;
import com.flowfund.engine.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BufferService {
    @Autowired
    private BufferRepository bufferRepo;
    @Autowired
    private TransactionRepository transactionRepo;

    public Buffer calculateAndSave(User user, BigDecimal forecast, BigDecimal volatility, String riskLevel,
            boolean isUnstable, BigDecimal annualTaxMultiplier, Double confidence) {

        List<Transaction> recent = transactionRepo.findByUserIdOrderByDateAsc(user.getId());

        // ISSUE 1 (Edge Case): Income Stops Completely (Collapse Mode)
        boolean isCollapse = recent.size() >= 2 &&
                recent.get(recent.size() - 1).getAmount().compareTo(BigDecimal.ZERO) == 0 &&
                recent.get(recent.size() - 2).getAmount().compareTo(BigDecimal.ZERO) == 0;

        if (isCollapse) {
            forecast = BigDecimal.ZERO;
            confidence = 0.05;
        } else if (forecast == null || forecast.compareTo(BigDecimal.ZERO) == 0) {
            forecast = user.getBaseIncome() != null ? user.getBaseIncome() : BigDecimal.ZERO;
        }

        // --- 1. Expense Aggregation + Inflation (ISSUE 6) ---
        BigDecimal monthlyDebt = user.getMonthlyDebt() != null ? user.getMonthlyDebt() : BigDecimal.ZERO;
        BigDecimal baseFixed = user.getRent().add(user.getGroceries()).add(user.getUtilities());

        // Inflation-Adjusted Future Expenses
        BigDecimal inflationMultiplier = BigDecimal.ONE
                .add(user.getInflationRate() != null ? user.getInflationRate() : new BigDecimal("0.06"));
        BigDecimal futureFixed = baseFixed.multiply(inflationMultiplier).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalFixedMonthly = baseFixed.add(monthlyDebt);

        // --- 2. Dynamic Emergency Target (6-10 months depending on Vol) ---
        // Target = 6 months + (Volatility * 4 months)
        double volatilityVal = volatility != null ? Math.min(1.0, volatility.doubleValue()) : 0.2;
        double monthsRunwayGoal = 6.0 + (volatilityVal * 4.0);
        BigDecimal totalRunwayGoalAmount = totalFixedMonthly.multiply(new BigDecimal(monthsRunwayGoal));

        double baseSaveRate = (riskLevel.equals("HIGH") || isCollapse) ? 0.40 : 0.25;
        double saveRate = Math.min(0.60, Math.max(0.10, baseSaveRate + (volatilityVal * 0.2)));
        BigDecimal totalSavings = forecast.multiply(BigDecimal.valueOf(saveRate));

        // --- 3. Medical Reserve Logic (Strict Cap 40%) ---
        double medicalBase = 0.15;
        if (user.getAge() > 45)
            medicalBase += 0.10;
        if (user.getDependents() > 0)
            medicalBase += (user.getDependents() * 0.05);
        double finalMedPct = Math.min(0.40, medicalBase);
        BigDecimal medicalBuffer = totalSavings.multiply(BigDecimal.valueOf(finalMedPct));

        Buffer buffer = bufferRepo.findByUser(user).orElse(new Buffer());
        buffer.setUser(user);

        // --- 4. Allocation with Runway Detection ---
        if (buffer.getTotalEmergencyFund() != null
                && buffer.getTotalEmergencyFund().compareTo(totalRunwayGoalAmount) >= 0) {
            buffer.setEmergencyBuffer(BigDecimal.ZERO);
            buffer.setRunwayCompleted(true);
            totalSavings = totalSavings.multiply(new BigDecimal("0.4")); // Only save 40% of normal rate for wealth
                                                                         // growth
        } else {
            BigDecimal emergencyAmt = totalSavings.subtract(medicalBuffer).max(BigDecimal.ZERO);
            buffer.setEmergencyBuffer(emergencyAmt);
            buffer.setRunwayCompleted(false);
            buffer.setTotalEmergencyFund(
                    (buffer.getTotalEmergencyFund() != null ? buffer.getTotalEmergencyFund() : BigDecimal.ZERO)
                            .add(emergencyAmt));
        }

        // --- 5. Safe Spend & Deficit Trigger ---
        // Safe Spend = Max(0, Inflow - Savings - Debt - Expenses)
        BigDecimal safeToSpend = forecast.subtract(totalSavings).subtract(totalFixedMonthly);
        if (safeToSpend.compareTo(BigDecimal.ZERO) < 0 || isCollapse) {
            buffer.setSafeToSpend(BigDecimal.ZERO);
            buffer.setIsDeficit(true);
        } else {
            buffer.setSafeToSpend(safeToSpend);
            buffer.setIsDeficit(false);
        }

        buffer.setTaxBuffer(annualTaxMultiplier);
        buffer.setMedicalBuffer(medicalBuffer);
        buffer.setRiskLevel(isCollapse ? "SYSTEM_CRITICAL_COLLAPSE" : riskLevel);
        buffer.setVolatility(volatility);
        buffer.setForecast(forecast);
        buffer.setLastUpdated(LocalDateTime.now());

        return bufferRepo.save(buffer);
    }
}
