package com.flowfund.engine.dto;

import lombok.*;
import java.util.List;

@Builder
public class TimeSeriesData {

    private List<Double> values;
    private List<String> dates;

    public List<Double> getValues() {
        return values;
    }

    public List<String> getDates() {
        return dates;
    }

    public TimeSeriesData() {
    }

    public TimeSeriesData(List<Double> values, List<String> dates) {
        this.values = values;
        this.dates = dates;
    }
}
