package com.flowfund.engine.service;

import com.flowfund.engine.entity.Transaction;
import com.flowfund.engine.entity.User;
import com.flowfund.engine.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {
    @Autowired
    private TransactionRepository transactionRepo;

    public com.flowfund.engine.dto.TimeSeriesData getMonthlyTimeSeries(User user) {
        List<Transaction> transactions = transactionRepo.findByUserIdOrderByDateAsc(user.getId()).stream()
                .filter(t -> "INCOME".equals(t.getType()))
                .collect(Collectors.toList());

        if (transactions.isEmpty())
            return new com.flowfund.engine.dto.TimeSeriesData(new ArrayList<>(), new ArrayList<>());

        Map<YearMonth, Double> incomeMap = transactions.stream()
                .collect(Collectors.groupingBy(
                        t -> YearMonth.from(t.getDate()),
                        Collectors.summingDouble(t -> t.getAmount().doubleValue())));

        YearMonth start = YearMonth.from(transactions.get(0).getDate());
        YearMonth end = YearMonth.from(LocalDate.now());
        List<Double> series = new ArrayList<>();
        List<String> dates = new ArrayList<>();

        while (!start.isAfter(end)) {
            series.add(incomeMap.getOrDefault(start, 0.0));
            dates.add(start.toString());
            start = start.plusMonths(1);
        }
        return new com.flowfund.engine.dto.TimeSeriesData(series, dates);
    }

    /**
     * ISSUE 3 (Hardening): Adjusted Volatility (CV + Gap Penalty)
     */
    public double calculateAdjustedVolatility(List<Double> data) {
        if (data.isEmpty())
            return 0.5;

        double mean = data.stream().mapToDouble(d -> d).average().orElse(0.0);

        // ISSUE 3: Floor for mean ≈ 0 (Use median instead)
        if (mean < 1000) {
            mean = calculateMedian(data);
            if (mean < 1000)
                mean = 1000.0; // Hard floor
        }

        final double finalMean = mean;
        double variance = data.stream().mapToDouble(d -> Math.pow(d - finalMean, 2)).sum() / data.size();
        double cv = Math.sqrt(variance) / finalMean;

        // ISSUE 3: Gap Penalty (Zero Income Months * 0.1)
        long zeroMonths = data.stream().filter(d -> d < 100).count();
        double adjustedVol = cv + (zeroMonths * 0.1);

        return Math.min(1.5, adjustedVol); // Max cap at 1.5 stability factor
    }

    private double calculateMedian(List<Double> data) {
        List<Double> sorted = data.stream().sorted().collect(Collectors.toList());
        int mid = sorted.size() / 2;
        return sorted.size() % 2 == 0 ? (sorted.get(mid) + sorted.get(mid - 1)) / 2.0 : sorted.get(mid);
    }

    public List<Double> getMonthlyIncomeSeries(User user) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getMonthlyIncomeSeries'");
    }
}
