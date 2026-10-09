package com.acme.salary.dto;

import java.math.BigDecimal;
import java.util.List;

public record PayParityDto(
        Double overallGenderGapPercentage,
        List<GenderMetric> genderBreakdown,
        List<DepartmentGenderMetric> departmentBreakdown
) {
    public record GenderMetric(
            String gender,
            long headcount,
            BigDecimal averageSalaryUsd,
            BigDecimal averageTotalCompUsd,
            Double averageCompaRatio
    ) {}

    public record DepartmentGenderMetric(
            String department,
            String gender,
            long headcount,
            BigDecimal averageSalaryUsd
    ) {}
}
