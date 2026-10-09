package com.acme.salary.dto;

import java.math.BigDecimal;

public record DepartmentAnalyticsDto(
        String department,
        long headcount,
        BigDecimal averageSalaryUsd,
        BigDecimal minSalaryUsd,
        BigDecimal maxSalaryUsd,
        BigDecimal totalPayrollUsd,
        Double averageCompaRatio
) {
}
