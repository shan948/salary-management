package com.acme.salary.dto;

import java.math.BigDecimal;

public record CountryAnalyticsDto(
        String country,
        String countryCode,
        String currency,
        long headcount,
        BigDecimal averageSalaryUsd,
        BigDecimal totalPayrollUsd,
        Double averageCompaRatio
) {
}
