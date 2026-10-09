package com.acme.salary.dto;

import java.math.BigDecimal;

public record JobLevelAnalyticsDto(
        String jobLevel,
        long headcount,
        BigDecimal averageSalaryUsd,
        BigDecimal averageTotalCompUsd,
        Double averageCompaRatio
) {
}
