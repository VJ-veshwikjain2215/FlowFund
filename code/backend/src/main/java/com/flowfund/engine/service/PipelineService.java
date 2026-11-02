package com.flowfund.engine.service;

import com.flowfund.engine.entity.*;
import com.flowfund.engine.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PipelineService {
    @Autowired
    private TransactionService transactionService;
    @Autowired
    private AnalyticsService analyticsService;
    @Autowired
    private ForecastService forecastService;
    @Autowired
    private TaxService taxService;
    @Autowired
    private BufferService bufferService;
    @Autowired
    private IntelligenceService intelligenceService;
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private BufferRepository bufferRepo;

    @Transactional
    public Buffer runFullPipeline(String email, MultipartFile file) {
        User user = userRepo.findByEmail(email).orElseThrow();

        if (file != null && !file.isEmpty()) {
            transactionService.processCSV(file, email);
        }

        com.flowfund.engine.dto.TimeSeriesData incomeData = analyticsService.getMonthlyTimeSeries(user);
        List<Double> incomeSeries = incomeData.getValues();
        if (incomeSeries.isEmpty()) {
            return generateFailSafeBuffer(user);
        }

        BigDecimal pastIncomeSum = incomeSeries.stream()
                .map(BigDecimal::valueOf)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 3. Hybrid AI Forecast (ROI Series + Multi-Factor Confidence)
        Map<String, Object> aiResult = forecastService.getForecast(incomeSeries, incomeData.getDates());

        BigDecimal forecast = BigDecimal.valueOf(((Number) aiResult.getOrDefault("forecast", 0.0)).doubleValue());
        List<BigDecimal> forecastSeries = ((List<?>) aiResult.getOrDefault("forecast_series", new ArrayList<>()))
                .stream().map(o -> BigDecimal.valueOf(((Number) o).doubleValue())).collect(Collectors.toList());

        BigDecimal volatility = BigDecimal.valueOf(((Number) aiResult.getOrDefault("volatility", 0.0)).doubleValue());
        Double confidence = ((Number) aiResult.getOrDefault("confidence", 1.0)).doubleValue();

        // 4. Calculate Tax using Spike Recalculation Model
        Buffer existing = bufferRepo.findByUser(user).orElse(new Buffer());
        BigDecimal monthlyTax = taxService.calculateMonthlyLiability(
                pastIncomeSum, forecast, incomeSeries.size(),
                existing.getTotalTaxSaved() != null ? existing.getTotalTaxSaved() : BigDecimal.ZERO,
                user.getTaxRegime() != null ? user.getTaxRegime() : "NEW");

        // 5. Calculate Elastic Buffers
        Buffer buffer = bufferService.calculateAndSave(user, forecast, volatility, "STABLE", false, monthlyTax,
                confidence);
        buffer.setForecastSeries(forecastSeries);

        // 6. Final Score & Insights
        generateFinalInsights(buffer, forecast, incomeSeries, monthlyTax, confidence);

        return bufferRepo.save(buffer);
    }

    private Buffer generateFailSafeBuffer(User user) {
        Buffer buffer = bufferRepo.findByUser(user).orElse(new Buffer());
        buffer.setUser(user);
        buffer.setSafeToSpend(BigDecimal.ZERO);
        buffer.setInsights(List.of("Waiting for financial artifacts. Initializing OS..."));
        buffer.setScore(0.0);
        buffer.setLastUpdated(LocalDateTime.now());
        return bufferRepo.save(buffer);
    }

    private void generateFinalInsights(Buffer buffer, BigDecimal forecast, List<Double> history,
            BigDecimal monthlyTax, Double confidence) {

        BigDecimal lastMonth = BigDecimal.valueOf((history.isEmpty()) ? 0 : history.get(history.size() - 1));
        User user = buffer.getUser();
        BigDecimal fixedExpenses = user.getRent().add(user.getGroceries()).add(user.getUtilities())
                .add(user.getMonthlyDebt());

        // Call Intelligence Service for multi-factor risk
        double multiRisk = intelligenceService.calculateRiskScore(
                buffer.getVolatility().doubleValue(),
                user.getDependents(),
                user.getIncomeConcentration(),
                user.getAge());

        List<String> insights = intelligenceService.generateSmartInsights(
                forecast, lastMonth, fixedExpenses, buffer.getEmergencyBuffer(), monthlyTax, confidence,
                buffer.getIsDeficit());

        // Health Scoring logic: Savings Ratio = Total Monthly Savings / Forecast
        BigDecimal totalSavings = forecast.subtract(buffer.getSafeToSpend()).subtract(fixedExpenses)
                .max(BigDecimal.ZERO);
        double savingsRatio = (forecast.compareTo(BigDecimal.ZERO) > 0)
                ? totalSavings.doubleValue() / forecast.doubleValue()
                : 0.0;

        double score = intelligenceService.calculateHealthScore(
                buffer.getVolatility().doubleValue(),
                savingsRatio,
                multiRisk,
                user.getAge(),
                user.getDependents());

        buffer.setInsights(insights);
        buffer.setScore(score);
        buffer.setLastUpdated(LocalDateTime.now());
    }
}
