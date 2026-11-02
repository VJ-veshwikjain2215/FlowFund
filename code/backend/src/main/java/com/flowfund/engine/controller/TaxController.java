package com.flowfund.engine.controller;

import com.flowfund.engine.entity.Tax;
import com.flowfund.engine.entity.User;
import com.flowfund.engine.repository.TaxRepository;
import com.flowfund.engine.repository.UserRepository;
import com.flowfund.engine.service.AnalyticsService;
import com.flowfund.engine.service.ForecastService;
import com.flowfund.engine.service.TaxService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tax")
public class TaxController {
    @Autowired
    private TaxService taxService;
    @Autowired
    private AnalyticsService analyticsService;
    @Autowired
    private ForecastService forecastService;
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private TaxRepository taxRepo;

    @GetMapping
    public Tax get() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByEmail(email).orElseThrow();
        return taxRepo.findByUser(user).orElse(new Tax());
    }

    @PostMapping("/recalculate")
    public Tax recalculate() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByEmail(email).orElseThrow();

        com.flowfund.engine.dto.TimeSeriesData incomeData = analyticsService.getMonthlyTimeSeries(user);
        List<Double> series = incomeData.getValues();
        @SuppressWarnings("null")
        BigDecimal sumSoFar = series.stream().map(BigDecimal::valueOf).reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> frMap = forecastService.getForecast(series, incomeData.getDates());
        BigDecimal projectedVal = BigDecimal.valueOf(((Number) frMap.getOrDefault("forecast", 0.0)).doubleValue());

        BigDecimal monthlyTax = taxService.calculateMonthlyLiability(
                sumSoFar, projectedVal, series.size(), BigDecimal.ZERO, user.getTaxRegime());

        Tax tax = taxRepo.findByUser(user).orElse(new Tax());
        tax.setUser(user);
        tax.setAnnualIncome(sumSoFar.add(projectedVal.multiply(new BigDecimal(Math.max(0, 12 - series.size())))));
        tax.setAnnualTax(monthlyTax.multiply(new BigDecimal("12"))); 
        tax.setMonthlyBuffer(monthlyTax);

        return taxRepo.save(tax);
    }
}
