package com.flowfund.engine.controller;

import com.flowfund.engine.entity.Buffer;
import com.flowfund.engine.service.PipelineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/insights")
public class IntelligenceController {
    @Autowired private PipelineService pipelineService;

    @GetMapping("/forecast")
    public Map<String, Object> getForecast() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Buffer b = pipelineService.runFullPipeline(email, null);
        
        BigDecimal totalPotential = b.getSafeToSpend()
            .add(b.getTaxBuffer())
            .add(b.getMedicalBuffer())
            .add(b.getEmergencyBuffer());

        return Map.of(
            "forecast", totalPotential,
            "riskLevel", b.getRiskLevel(),
            "volatility", b.getVolatility()
        );
    }

    @GetMapping("/score")
    public Map<String, Double> getScore() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return Map.of("score", pipelineService.runFullPipeline(email, null).getScore());
    }
}
