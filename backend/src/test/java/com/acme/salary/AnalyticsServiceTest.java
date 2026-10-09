package com.acme.salary;

import com.acme.salary.dto.*;
import com.acme.salary.model.Employee;
import com.acme.salary.repository.EmployeeRepository;
import com.acme.salary.service.AnalyticsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AnalyticsServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    private AnalyticsService analyticsService;

    @BeforeEach
    void setUp() {
        analyticsService = new AnalyticsService(employeeRepository);
    }

    @Test
    void testGetDashboardSummaryAggregations() {
        List<Object[]> overall = new ArrayList<>();
        overall.add(new Object[]{10000L, 1200000000.0, 1000000000.0, 100000.0, 50000.0, 400000.0, 1.02});
        when(employeeRepository.getOverallMetrics()).thenReturn(overall);

        when(employeeRepository.countBelowBand()).thenReturn(450L);
        when(employeeRepository.countInBand()).thenReturn(9100L);
        when(employeeRepository.countAboveBand()).thenReturn(450L);

        // Mock department analytics
        List<Object[]> deptList = new ArrayList<>();
        deptList.add(new Object[]{"Engineering", 3500L, 120000.0, 65000.0, 350000.0, 420000000.0, 1.05});
        when(employeeRepository.getDepartmentAnalytics()).thenReturn(deptList);

        // Mock country analytics
        List<Object[]> countryList = new ArrayList<>();
        countryList.add(new Object[]{"United States", "USA", "USD", 5000L, 115000.0, 600000000.0, 1.03});
        when(employeeRepository.getCountryAnalytics()).thenReturn(countryList);

        // Mock job levels
        List<Object[]> levelList = new ArrayList<>();
        levelList.add(new Object[]{"L3 - Senior", 2600L, 130000.0, 160000.0, 1.01});
        when(employeeRepository.getJobLevelAnalytics()).thenReturn(levelList);

        // Mock gender parity: Male avg 102,000, Female avg 100,000 -> gap ~ 1.96%
        List<Object[]> genderList = new ArrayList<>();
        genderList.add(new Object[]{"MALE", 5200L, 102000.0, 122000.0, 1.02});
        genderList.add(new Object[]{"FEMALE", 4400L, 100000.0, 120000.0, 1.01});
        when(employeeRepository.getGenderParityAnalytics()).thenReturn(genderList);

        DashboardSummaryDto summary = analyticsService.getDashboardSummary();

        assertThat(summary.totalHeadcount()).isEqualTo(10000L);
        assertThat(summary.employeesBelowBand()).isEqualTo(450L);
        assertThat(summary.employeesInBand()).isEqualTo(9100L);
        assertThat(summary.employeesAboveBand()).isEqualTo(450L);
        assertThat(summary.averageCompaRatio()).isEqualTo(1.02);
        assertThat(summary.departmentBreakdown()).hasSize(1);
        assertThat(summary.departmentBreakdown().get(0).department()).isEqualTo("Engineering");
        assertThat(summary.genderPayGapPercentage()).isCloseTo(1.96, org.assertj.core.data.Offset.offset(0.05));
    }

    @Test
    void testSimulateWhatIfIncrease() {
        Employee emp1 = new Employee("EMP-1", "A", "B", "a@acme.org", "MALE", "USA", "USA", "SF",
                "Engineering", "Dev", "L2", "USD",
                BigDecimal.valueOf(100000), BigDecimal.valueOf(100000),
                10.0, BigDecimal.valueOf(10000), 4,
                BigDecimal.valueOf(80000), BigDecimal.valueOf(100000), BigDecimal.valueOf(120000),
                LocalDate.now());

        Employee emp2 = new Employee("EMP-2", "C", "D", "c@acme.org", "FEMALE", "USA", "USA", "SF",
                "Engineering", "Dev", "L2", "USD",
                BigDecimal.valueOf(100000), BigDecimal.valueOf(100000),
                10.0, BigDecimal.valueOf(10000), 4,
                BigDecimal.valueOf(80000), BigDecimal.valueOf(100000), BigDecimal.valueOf(120000),
                LocalDate.now());

        when(employeeRepository.findAll()).thenReturn(List.of(emp1, emp2));

        WhatIfSimulationRequest req = new WhatIfSimulationRequest(5.0, "Engineering", null, null);
        WhatIfSimulationResponse res = analyticsService.simulateWhatIf(req);

        assertThat(res.impactedEmployees()).isEqualTo(2);
        assertThat(res.percentageIncrease()).isEqualTo(5.0);
        // Each emp totalComp = 100,000 + 10,000 bonus + 10,000 equity = 120,000. Total = 240,000.
        // 5% increase -> 240,000 * 1.05 = 252,000. Cost delta = 12,000.
        assertThat(res.currentPayrollUsd()).isEqualByComparingTo("240000.00");
        assertThat(res.projectedPayrollUsd()).isEqualByComparingTo("252000.00");
        assertThat(res.annualCostDeltaUsd()).isEqualByComparingTo("12000.00");
    }

    @Test
    void testQuestionsAndAnswersProvidesComprehensiveCards() {
        List<Object[]> overall = new ArrayList<>();
        overall.add(new Object[]{10000L, 1000000.0, 800000.0, 80000.0, 40000.0, 200000.0, 1.0});
        when(employeeRepository.getOverallMetrics()).thenReturn(overall);
        when(employeeRepository.countBelowBand()).thenReturn(100L);
        when(employeeRepository.countInBand()).thenReturn(9800L);
        when(employeeRepository.countAboveBand()).thenReturn(100L);
        when(employeeRepository.getDepartmentAnalytics()).thenReturn(List.of());
        when(employeeRepository.getCountryAnalytics()).thenReturn(List.of());
        when(employeeRepository.getJobLevelAnalytics()).thenReturn(List.of());
        when(employeeRepository.getGenderParityAnalytics()).thenReturn(List.of());

        QnAResponseDto qna = analyticsService.getQuestionsAndAnswers();

        assertThat(qna.questions()).isNotEmpty();
        assertThat(qna.questions()).extracting(QnAResponseDto.QuestionAnswerItem::category)
                .contains("SPEND", "PARITY", "BANDS", "GEOGRAPHY");
    }
}
