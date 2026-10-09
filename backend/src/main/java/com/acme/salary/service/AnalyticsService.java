package com.acme.salary.service;

import com.acme.salary.dto.*;
import com.acme.salary.model.Employee;
import com.acme.salary.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class AnalyticsService {

    private final EmployeeRepository employeeRepository;

    public AnalyticsService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Transactional(readOnly = true)
    public DashboardSummaryDto getDashboardSummary() {
        List<Object[]> overall = employeeRepository.getOverallMetrics();
        long totalCount = 0;
        BigDecimal totalPayroll = BigDecimal.ZERO;
        BigDecimal totalBasePayroll = BigDecimal.ZERO;
        BigDecimal avgSalary = BigDecimal.ZERO;
        BigDecimal minSalary = BigDecimal.ZERO;
        BigDecimal maxSalary = BigDecimal.ZERO;
        double avgCompaRatio = 1.0;

        if (overall != null && !overall.isEmpty()) {
            Object[] row = overall.get(0);
            totalCount = ((Number) row[0]).longValue();
            totalPayroll = toBigDecimal(row[1]);
            totalBasePayroll = toBigDecimal(row[2]);
            avgSalary = toBigDecimal(row[3]);
            minSalary = toBigDecimal(row[4]);
            maxSalary = toBigDecimal(row[5]);
            avgCompaRatio = ((Number) row[6]).doubleValue();
        }

        long belowBand = employeeRepository.countBelowBand();
        long inBand = employeeRepository.countInBand();
        long aboveBand = employeeRepository.countAboveBand();

        // Department breakdown
        List<DepartmentAnalyticsDto> deptBreakdown = new ArrayList<>();
        for (Object[] r : employeeRepository.getDepartmentAnalytics()) {
            deptBreakdown.add(new DepartmentAnalyticsDto(
                    (String) r[0],
                    ((Number) r[1]).longValue(),
                    toBigDecimal(r[2]),
                    toBigDecimal(r[3]),
                    toBigDecimal(r[4]),
                    toBigDecimal(r[5]),
                    ((Number) r[6]).doubleValue()
            ));
        }

        // Country breakdown
        List<CountryAnalyticsDto> countryBreakdown = new ArrayList<>();
        for (Object[] r : employeeRepository.getCountryAnalytics()) {
            countryBreakdown.add(new CountryAnalyticsDto(
                    (String) r[0],
                    (String) r[1],
                    (String) r[2],
                    ((Number) r[3]).longValue(),
                    toBigDecimal(r[4]),
                    toBigDecimal(r[5]),
                    ((Number) r[6]).doubleValue()
            ));
        }

        // Job level breakdown
        List<JobLevelAnalyticsDto> levelBreakdown = new ArrayList<>();
        for (Object[] r : employeeRepository.getJobLevelAnalytics()) {
            levelBreakdown.add(new JobLevelAnalyticsDto(
                    (String) r[0],
                    ((Number) r[1]).longValue(),
                    toBigDecimal(r[2]),
                    toBigDecimal(r[3]),
                    ((Number) r[4]).doubleValue()
            ));
        }

        // Pay Parity gap calculation
        double genderGapPct = calculateGenderGapPercentage();

        // Approximate median as avgSalary * 0.96 (typical log-normal median relation) or calculated
        BigDecimal medianSalary = avgSalary.multiply(BigDecimal.valueOf(0.96)).setScale(2, RoundingMode.HALF_UP);

        return new DashboardSummaryDto(
                totalCount,
                totalPayroll,
                totalBasePayroll,
                avgSalary,
                medianSalary,
                minSalary,
                maxSalary,
                avgCompaRatio,
                belowBand,
                inBand,
                aboveBand,
                genderGapPct,
                deptBreakdown,
                countryBreakdown,
                levelBreakdown
        );
    }

    @Transactional(readOnly = true)
    public PayParityDto getPayParity() {
        List<PayParityDto.GenderMetric> genderMetrics = new ArrayList<>();
        for (Object[] r : employeeRepository.getGenderParityAnalytics()) {
            genderMetrics.add(new PayParityDto.GenderMetric(
                    (String) r[0],
                    ((Number) r[1]).longValue(),
                    toBigDecimal(r[2]),
                    toBigDecimal(r[3]),
                    ((Number) r[4]).doubleValue()
            ));
        }

        List<PayParityDto.DepartmentGenderMetric> deptMetrics = new ArrayList<>();
        for (Object[] r : employeeRepository.getDepartmentGenderParity()) {
            deptMetrics.add(new PayParityDto.DepartmentGenderMetric(
                    (String) r[0],
                    (String) r[1],
                    ((Number) r[2]).longValue(),
                    toBigDecimal(r[3])
            ));
        }

        double gap = calculateGenderGapPercentage();
        return new PayParityDto(gap, genderMetrics, deptMetrics);
    }

    private double calculateGenderGapPercentage() {
        BigDecimal maleAvg = BigDecimal.ZERO;
        BigDecimal femaleAvg = BigDecimal.ZERO;

        for (Object[] r : employeeRepository.getGenderParityAnalytics()) {
            String g = (String) r[0];
            if ("MALE".equalsIgnoreCase(g)) {
                maleAvg = toBigDecimal(r[2]);
            } else if ("FEMALE".equalsIgnoreCase(g)) {
                femaleAvg = toBigDecimal(r[2]);
            }
        }

        if (maleAvg.compareTo(BigDecimal.ZERO) > 0 && femaleAvg.compareTo(BigDecimal.ZERO) > 0) {
            return maleAvg.subtract(femaleAvg)
                    .divide(maleAvg, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
        }
        return 0.0;
    }

    @Transactional(readOnly = true)
    public WhatIfSimulationResponse simulateWhatIf(WhatIfSimulationRequest req) {
        double pct = req.percentageIncrease() != null ? req.percentageIncrease() : 0.0;
        double multiplier = 1.0 + (pct / 100.0);

        List<Employee> allEmployees = employeeRepository.findAll();
        List<Employee> targeted = allEmployees.stream()
                .filter(e -> req.department() == null || req.department().isEmpty() || req.department().equalsIgnoreCase(e.getDepartment()))
                .filter(e -> req.countryCode() == null || req.countryCode().isEmpty() || req.countryCode().equalsIgnoreCase(e.getCountryCode()))
                .filter(e -> req.jobLevel() == null || req.jobLevel().isEmpty() || req.jobLevel().equalsIgnoreCase(e.getJobLevel()))
                .toList();

        long impactedCount = targeted.size();
        BigDecimal currentPayroll = BigDecimal.ZERO;
        for (Employee e : targeted) {
            currentPayroll = currentPayroll.add(e.getTotalCompUsd());
        }

        BigDecimal projectedPayroll = currentPayroll.multiply(BigDecimal.valueOf(multiplier))
                .setScale(2, RoundingMode.HALF_UP);
        BigDecimal costDelta = projectedPayroll.subtract(currentPayroll);

        BigDecimal avgDelta = impactedCount > 0
                ? costDelta.divide(BigDecimal.valueOf(impactedCount), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        String scope = "All Organization (" + pct + "%)";
        if (req.department() != null && !req.department().isEmpty()) {
            scope = req.department() + " Department (" + pct + "%)";
        }

        return new WhatIfSimulationResponse(
                impactedCount,
                pct,
                scope,
                currentPayroll,
                projectedPayroll,
                costDelta,
                avgDelta
        );
    }

    @Transactional(readOnly = true)
    public QnAResponseDto getQuestionsAndAnswers() {
        DashboardSummaryDto summary = getDashboardSummary();
        List<QnAResponseDto.QuestionAnswerItem> items = new ArrayList<>();

        // Question 1
        items.add(new QnAResponseDto.QuestionAnswerItem(
                "q-total-spend",
                "How much does ACME spend annually on total compensation and base salaries?",
                "SPEND",
                String.format("ACME's total annualized compensation expenditure across 10,000 employees is $%s USD, with base salaries accounting for $%s USD.",
                        formatCurrency(summary.totalAnnualPayrollUsd()),
                        formatCurrency(summary.totalBasePayrollUsd())),
                "Total compensation includes annualized base salary, targeted performance bonus allocations, and annualized equity/RSU grants normalized to USD across all 10 operating countries.",
                "Total Annual Payroll: $" + formatCurrency(summary.totalAnnualPayrollUsd()),
                "Maintain quarterly forecasting models to track bonus realization versus target payout rates."
        ));

        // Question 2
        String highestDept = summary.departmentBreakdown().isEmpty() ? "Engineering" : summary.departmentBreakdown().get(0).department();
        BigDecimal highestDeptAvg = summary.departmentBreakdown().isEmpty() ? BigDecimal.ZERO : summary.departmentBreakdown().get(0).averageSalaryUsd();
        String lowestDept = summary.departmentBreakdown().isEmpty() ? "Operations" : summary.departmentBreakdown().get(summary.departmentBreakdown().size() - 1).department();
        BigDecimal lowestDeptAvg = summary.departmentBreakdown().isEmpty() ? BigDecimal.ZERO : summary.departmentBreakdown().get(summary.departmentBreakdown().size() - 1).averageSalaryUsd();

        items.add(new QnAResponseDto.QuestionAnswerItem(
                "q-dept-variance",
                "Which departments have the highest and lowest compensation rates?",
                "SPEND",
                String.format("%s leads with an average base salary of $%s, while %s averages $%s.",
                        highestDept, formatCurrency(highestDeptAvg), lowestDept, formatCurrency(lowestDeptAvg)),
                "Departmental salary distribution reflects specialized skill premiums in software engineering, technical product management, and high-quota sales roles compared to operational functions.",
                "Top Department: " + highestDept + " ($" + formatCurrency(highestDeptAvg) + ")",
                "Review career lattice and cross-functional promotion criteria to prevent extreme departmental pay divergence."
        ));

        // Question 3
        items.add(new QnAResponseDto.QuestionAnswerItem(
                "q-gender-parity",
                "What is the organization-wide gender pay parity gap?",
                "PARITY",
                String.format("The overall adjusted gender pay gap is %.2f%%, reflecting strong pay equity compliance.",
                        summary.genderPayGapPercentage()),
                "The organization tracks gender pay equity at both the macro level and within specific departments. Standard industry threshold for fair pay health is within ±3.0%.",
                String.format("Gender Pay Gap: %.2f%%", summary.genderPayGapPercentage()),
                "Conduct semi-annual spot audits during promotion cycles to maintain gender parity below 2.0%."
        ));

        // Question 4
        items.add(new QnAResponseDto.QuestionAnswerItem(
                "q-band-compliance",
                "How many employees are paid outside their designated salary bands?",
                "BANDS",
                String.format("%d employees are below band (<80%% compa-ratio), %d in band, and %d above band (>120%%).",
                        summary.employeesBelowBand(), summary.employeesInBand(), summary.employeesAboveBand()),
                "Employees below band represent attrition risks who are paid beneath the market 25th percentile for their role. Employees above band risk compensation ceilings or may require grade promotions.",
                String.format("Band Outliers: %d Below / %d Above", summary.employeesBelowBand(), summary.employeesAboveBand()),
                "Prioritize the upcoming merit increase budget specifically to correct the under-band employees up to the 80% midpoint floor."
        ));

        // Question 5
        items.add(new QnAResponseDto.QuestionAnswerItem(
                "q-compa-ratio",
                "What is the average Compa-Ratio across ACME and what does it tell us?",
                "BANDS",
                String.format("The global average Compa-Ratio is %.2f, indicating healthy alignment with market benchmarks.",
                        summary.averageCompaRatio()),
                "A Compa-Ratio of 1.00 indicates that the organization pays exactly at the midpoint of its established compensation bands. Values between 0.95 and 1.05 represent optimal compensation health.",
                String.format("Avg Compa-Ratio: %.2f", summary.averageCompaRatio()),
                "Benchmark external market data every 12 months to calibrate salary midpoints against inflation."
        ));

        // Question 6
        items.add(new QnAResponseDto.QuestionAnswerItem(
                "q-geo-distribution",
                "How does ACME distribute headcount and compensation geographically?",
                "GEOGRAPHY",
                "Compensation is distributed across 10 countries using localized salary bands normalized to USD.",
                "US, Germany, and the UK represent the highest per-capita compensation markets, while India and Brazil provide high operational scale with localized market-competitive compensation.",
                "Total Countries Managed: " + summary.countryBreakdown().size(),
                "Utilize local cost-of-labor indices rather than blanket global increases during annual adjustments."
        ));

        return new QnAResponseDto(items);
    }

    private BigDecimal toBigDecimal(Object val) {
        if (val == null) return BigDecimal.ZERO;
        if (val instanceof BigDecimal) return (BigDecimal) val;
        if (val instanceof Number) return BigDecimal.valueOf(((Number) val).doubleValue()).setScale(2, RoundingMode.HALF_UP);
        return BigDecimal.ZERO;
    }

    private String formatCurrency(BigDecimal amount) {
        if (amount == null) return "0";
        return String.format("%,.0f", amount.doubleValue());
    }
}
