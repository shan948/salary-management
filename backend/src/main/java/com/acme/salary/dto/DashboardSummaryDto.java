package com.acme.salary.dto;

import java.math.BigDecimal;
import java.util.List;

public record DashboardSummaryDto(
        long totalHeadcount,
        BigDecimal totalAnnualPayrollUsd,
        BigDecimal totalBasePayrollUsd,
        BigDecimal averageBaseSalaryUsd,
        BigDecimal medianBaseSalaryUsd,
        BigDecimal minBaseSalaryUsd,
        BigDecimal maxBaseSalaryUsd,
        Double averageCompaRatio,
        long employeesBelowBand,
        long employeesInBand,
        long employeesAboveBand,
        Double genderPayGapPercentage,
        List<DepartmentAnalyticsDto> departmentBreakdown,
        List<CountryAnalyticsDto> countryBreakdown,
        List<JobLevelAnalyticsDto> jobLevelBreakdown
) {
}
