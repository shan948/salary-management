package com.acme.salary;

import com.acme.salary.dto.EmployeeDto;
import com.acme.salary.dto.SalaryAdjustmentRequest;
import com.acme.salary.model.Employee;
import com.acme.salary.model.SalaryAdjustmentLog;
import com.acme.salary.repository.EmployeeRepository;
import com.acme.salary.repository.SalaryAdjustmentLogRepository;
import com.acme.salary.service.EmployeeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private SalaryAdjustmentLogRepository auditLogRepository;

    private EmployeeService employeeService;

    private Employee testEmployee;

    @BeforeEach
    void setUp() {
        employeeService = new EmployeeService(employeeRepository, auditLogRepository);

        testEmployee = new Employee(
                "EMP-00001", "Jane", "Doe", "jane.doe@acme.org", "FEMALE",
                "United States", "USA", "San Francisco", "Engineering",
                "Senior Software Engineer", "L3 - Senior", "USD",
                BigDecimal.valueOf(150000), BigDecimal.valueOf(150000),
                15.0, BigDecimal.valueOf(25000), 4,
                BigDecimal.valueOf(125000), BigDecimal.valueOf(155000), BigDecimal.valueOf(185000),
                LocalDate.of(2022, 1, 15)
        );
        testEmployee.setId(1L);
    }

    @Test
    void testSearchEmployeesReturnsMappedDtoPage() {
        Page<Employee> page = new PageImpl<>(List.of(testEmployee));
        when(employeeRepository.searchEmployees(any(), any(), any(), any(), any(), any()))
                .thenReturn(page);

        Page<EmployeeDto> result = employeeService.searchEmployees("Jane", "Engineering", "USA", "L3 - Senior", "FEMALE", PageRequest.of(0, 10));

        assertThat(result.getContent()).hasSize(1);
        EmployeeDto dto = result.getContent().get(0);
        assertThat(dto.employeeId()).isEqualTo("EMP-00001");
        assertThat(dto.fullName()).isEqualTo("Jane Doe");
        assertThat(dto.department()).isEqualTo("Engineering");
        assertThat(dto.compaRatioStatus()).isEqualTo("IN_BAND");
    }

    @Test
    void testGetEmployeeByIdSuccess() {
        when(employeeRepository.findByEmployeeId("EMP-00001")).thenReturn(Optional.of(testEmployee));

        EmployeeDto result = employeeService.getEmployeeById("EMP-00001");

        assertThat(result).isNotNull();
        assertThat(result.employeeId()).isEqualTo("EMP-00001");
        assertThat(result.baseSalaryUsd()).isEqualByComparingTo("150000.00");
    }

    @Test
    void testGetEmployeeByIdNotFoundThrowsException() {
        when(employeeRepository.findByEmployeeId("EMP-99999")).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> {
            employeeService.getEmployeeById("EMP-99999");
        });
    }

    @Test
    void testAdjustSalaryUpdatesEntityAndCreatesAuditLog() {
        when(employeeRepository.findByEmployeeId("EMP-00001")).thenReturn(Optional.of(testEmployee));
        when(employeeRepository.save(any(Employee.class))).thenAnswer(invocation -> invocation.getArgument(0));

        SalaryAdjustmentRequest req = new SalaryAdjustmentRequest(
                BigDecimal.valueOf(165000),
                18.0,
                BigDecimal.valueOf(30000),
                "PROMOTION",
                "Promoted to Lead Architect",
                "VP HR"
        );

        EmployeeDto updated = employeeService.adjustSalary("EMP-00001", req);

        // Verify entity updates
        assertThat(updated.baseSalaryUsd()).isEqualByComparingTo("165000.00");
        assertThat(updated.bonusPercentage()).isEqualTo(18.0);
        assertThat(updated.equityUsd()).isEqualByComparingTo("30000.00");

        // Verify audit log captured
        ArgumentCaptor<SalaryAdjustmentLog> auditCaptor = ArgumentCaptor.forClass(SalaryAdjustmentLog.class);
        verify(auditLogRepository).save(auditCaptor.capture());

        SalaryAdjustmentLog capturedLog = auditCaptor.getValue();
        assertThat(capturedLog.getEmployeeId()).isEqualTo("EMP-00001");
        assertThat(capturedLog.getPreviousSalaryUsd()).isEqualByComparingTo("150000.00");
        assertThat(capturedLog.getNewSalaryUsd()).isEqualByComparingTo("165000.00");
        assertThat(capturedLog.getPercentageChange()).isEqualTo(10.0);
        assertThat(capturedLog.getReason()).isEqualTo("PROMOTION");
        assertThat(capturedLog.getAdjustedBy()).isEqualTo("VP HR");
    }
}
