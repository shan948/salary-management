package com.acme.salary.dto;

import com.acme.salary.model.Employee;
import java.math.BigDecimal;
import java.time.LocalDate;

public record EmployeeDto(
        Long id,
        String employeeId,
        String firstName,
        String lastName,
        String fullName,
        String email,
        String gender,
        String country,
        String countryCode,
        String city,
        String department,
        String jobTitle,
        String jobLevel,
        String currency,
        BigDecimal baseSalaryLocal,
        BigDecimal baseSalaryUsd,
        Double bonusPercentage,
        BigDecimal equityUsd,
        BigDecimal totalCompUsd,
        Integer performanceRating,
        Double compaRatio,
        String compaRatioStatus,
        BigDecimal bandMinUsd,
        BigDecimal bandMidUsd,
        BigDecimal bandMaxUsd,
        LocalDate hireDate
) {
    public static EmployeeDto fromEntity(Employee emp) {
        String status;
        if (emp.getCompaRatio() < 0.80) {
            status = "BELOW_BAND";
        } else if (emp.getCompaRatio() > 1.20) {
            status = "ABOVE_BAND";
        } else {
            status = "IN_BAND";
        }

        return new EmployeeDto(
                emp.getId(),
                emp.getEmployeeId(),
                emp.getFirstName(),
                emp.getLastName(),
                emp.getFullName(),
                emp.getEmail(),
                emp.getGender(),
                emp.getCountry(),
                emp.getCountryCode(),
                emp.getCity(),
                emp.getDepartment(),
                emp.getJobTitle(),
                emp.getJobLevel(),
                emp.getCurrency(),
                emp.getBaseSalaryLocal(),
                emp.getBaseSalaryUsd(),
                emp.getBonusPercentage(),
                emp.getEquityUsd(),
                emp.getTotalCompUsd(),
                emp.getPerformanceRating(),
                emp.getCompaRatio(),
                status,
                emp.getBandMinUsd(),
                emp.getBandMidUsd(),
                emp.getBandMaxUsd(),
                emp.getHireDate()
        );
    }
}
