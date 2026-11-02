package com.flowfund.engine.service;

import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class TaxService {

    /**
     * ISSUE 4: Spike Tax Recalculation (Real recalculation, not guessing)
     */
    public BigDecimal calculateMonthlyLiability(BigDecimal pastIncomeSum, BigDecimal forecast, int monthsPassed, 
                                               BigDecimal currentlySaved, String regime) {
        int remainingMonths = 12 - monthsPassed;
        if (remainingMonths <= 0) remainingMonths = 1;

        // 1. Current annual projection
        BigDecimal currentAnnualProjection = pastIncomeSum.add(forecast.multiply(new BigDecimal(remainingMonths)));
        
        // 2. Previous annual projection (Assume last month's forecast was used for past months)
        BigDecimal monthlyAvg = pastIncomeSum.divide(new BigDecimal(Math.max(1, monthsPassed)), 2, RoundingMode.HALF_UP);
        BigDecimal oldAnnualProjection = pastIncomeSum.add(monthlyAvg.multiply(new BigDecimal(remainingMonths)));

        // 3. Diff-based Spike Tax
        BigDecimal newAnnualTax = calculateTaxByRegime(currentAnnualProjection, regime);
        BigDecimal oldAnnualTax = calculateTaxByRegime(oldAnnualProjection, regime);
        BigDecimal spikePortion = newAnnualTax.subtract(oldAnnualTax).max(BigDecimal.ZERO);

        // Calculate standard monthly amount
        BigDecimal remainingLiability = newAnnualTax.subtract(currentlySaved).max(BigDecimal.ZERO);
        BigDecimal monthlyBase = remainingLiability.divide(new BigDecimal(remainingMonths), 2, RoundingMode.HALF_UP);

        // If spike is significant (>10% of monthly income), front-load it
        BigDecimal finalBuffer = monthlyBase;
        if (spikePortion.compareTo(forecast.multiply(new BigDecimal("0.05"))) > 0) {
            finalBuffer = monthlyBase.add(spikePortion.multiply(new BigDecimal("0.4"))); // Capture 40% of the diff spike immediately
        }

        return finalBuffer;
    }

    public BigDecimal calculateTaxByRegime(BigDecimal income, String regime) {
        if ("OLD".equals(regime)) return calculateOldRegimeTax(income);
        return calculateNewRegimeTax(income);
    }

    public BigDecimal calculateNewRegimeTax(BigDecimal income) {
        double remaining = income.doubleValue();
        double tax = 0;
        if (remaining > 1500000) { tax += (remaining - 1500000) * 0.30; remaining = 1500000; }
        if (remaining > 1200000) { tax += (remaining - 1200000) * 0.20; remaining = 1200000; }
        if (remaining > 900000)  { tax += (remaining - 900000) * 0.15;  remaining = 900000; }
        if (remaining > 600000)  { tax += (remaining - 600000) * 0.10;  remaining = 600000; }
        if (remaining > 300000)  { tax += (remaining - 300000) * 0.05;  }
        return BigDecimal.valueOf(tax * 1.04).setScale(2, RoundingMode.HALF_UP);
    }

    public BigDecimal calculateOldRegimeTax(BigDecimal income) {
        double remaining = income.doubleValue() - 50000; // Standard deduction
        double tax = 0;
        if (remaining > 1000000) { tax += (remaining - 1000000) * 0.30; remaining = 1000000; }
        if (remaining > 500000)  { tax += (remaining - 500000) * 0.20;  remaining = 500000; }
        if (remaining > 250000)  { tax += (remaining - 250000) * 0.05;  }
        return BigDecimal.valueOf(tax * 1.04).setScale(2, RoundingMode.HALF_UP);
    }
}
