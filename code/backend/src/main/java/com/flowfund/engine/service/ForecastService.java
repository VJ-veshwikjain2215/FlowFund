package com.flowfund.engine.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestTemplate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ForecastService {

    @Value("${app.ai-service.url}")
    private String ARIMA_API;

    /**
     * ISSUE 2: Hybrid Forecast Model (ARIMA + WMA + Median)
     */
    public Map<String, Object> getForecast(List<Double> data, List<String> dates) {
        Map<String, Object> result = new HashMap<>();
        if (data == null || data.isEmpty()) throw new RuntimeException("No data available");

        double cv = calculateVolatility(data);
        
        // --- 1. Confidence Formula (P26 Multi-Factor) ---
        double completeness = Math.min(1.0, data.size() / 12.0);
        double trendConsistency = calculateTrendConsistency(data);
        double recencyStability = calculateRecencyStability(data);
        double confidence = (1.0 / (1.0 + cv)) * completeness * trendConsistency * recencyStability;

        // --- 2. Hybrid Model Execution ---
        double arimaVal = getArimaForecast(data, dates);
        double wmaVal = calculateWMA(data);
        double medianVal = calculateMedian(data);
        
        // Distribution: ARIMA 40%, WMA 40%, Median 20%
        double hybridForecast = (arimaVal * 0.4) + (wmaVal * 0.4) + (medianVal * 0.2);

        // --- 3. Scenario Simulation (P25/P75) ---
        populateScenarios(result, hybridForecast, data, confidence, cv);
        
        result.put("forecast", hybridForecast);
        result.put("confidence", confidence);
        result.put("volatility", cv);
        result.put("method", "hybrid_model_robust_v2");
        return result;
    }

    private double getArimaForecast(List<Double> data, List<String> dates) {
        try {
            if (data.size() < 7) return calculateWMA(data);
            RestTemplate rest = new RestTemplate();
            Map<String, Object> req = new HashMap<>();
            req.put("data", data);
            req.put("dates", dates);
            Map<String, Object> res = rest.postForObject(ARIMA_API, req, Map.class);
            return Double.parseDouble(res.get("forecast").toString());
        } catch (Exception e) {
            return calculateWMA(data);
        }
    }

    private double calculateWMA(List<Double> data) {
        if (data.isEmpty()) return 0.0;
        if (data.size() == 1) return data.get(0);
        // Last 0.7, Previous 0.3
        return (data.get(data.size()-1) * 0.7) + (data.get(data.size()-2) * 0.3);
    }

    private double calculateMedian(List<Double> data) {
        List<Double> sorted = data.stream().sorted().collect(Collectors.toList());
        int mid = sorted.size() / 2;
        return sorted.size() % 2 == 0 ? (sorted.get(mid) + sorted.get(mid - 1)) / 2.0 : sorted.get(mid);
    }

    private double calculateTrendConsistency(List<Double> data) {
        if (data.size() < 3) return 0.5;
        double slope1 = data.get(data.size()-1) - data.get(data.size()-2);
        double slope2 = data.get(data.size()-2) - data.get(data.size()-3);
        double diff = Math.abs(slope1 - slope2);
        double mean = calculateMedian(data);
        return 1.0 / (1.0 + (diff / (mean + 1.0)));
    }

    private double calculateRecencyStability(List<Double> data) {
        if (data.size() < 2) return 0.5;
        double last = data.get(data.size()-1);
        double prev = data.get(data.size()-2);
        double dev = Math.abs(last - prev);
        return 1.0 / (1.0 + (dev / (last + 1.0)));
    }

    private void populateScenarios(Map<String, Object> result, double base, List<Double> data, double confidence, double cv) {
        double mean = data.stream().mapToDouble(d -> d).average().orElse(0.0);
        double std = Math.sqrt(data.stream().mapToDouble(d -> Math.pow(d - mean, 2)).sum() / data.size());
        
        double p25 = Math.max(0, mean - (0.675 * std));
        double p75 = mean + (0.675 * std);

        result.put("worst_case", (p25 * (1 - confidence)) + (base * confidence * 0.8));
        result.put("best_case", p75);
        
        List<Double> series = new ArrayList<>();
        for (int i = 0; i < 6; i++) series.add(base);
        result.put("forecast_series", series);
    }

    private double calculateVolatility(List<Double> data) {
        double mean = data.stream().mapToDouble(d -> d).average().orElse(0.0);
        if (mean == 0) return 0.1;
        double variance = data.stream().mapToDouble(d -> Math.pow(d - mean, 2)).sum() / data.size();
        return Math.sqrt(variance) / mean; 
    }
}
