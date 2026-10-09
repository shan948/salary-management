package com.acme.salary.service;

import com.acme.salary.dto.EmployeeDto;
import com.acme.salary.dto.SalaryAdjustmentRequest;
import com.acme.salary.model.Employee;
import com.acme.salary.model.SalaryAdjustmentLog;
import com.acme.salary.repository.EmployeeRepository;
import com.acme.salary.repository.SalaryAdjustmentLogRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final SalaryAdjustmentLogRepository auditLogRepository;

    public EmployeeService(EmployeeRepository employeeRepository,
                           SalaryAdjustmentLogRepository auditLogRepository) {
        this.employeeRepository = employeeRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional(readOnly = true)
    public Page<EmployeeDto> searchEmployees(String query, String department, String countryCode,
                                            String jobLevel, String gender, Pageable pageable) {
        return employeeRepository.searchEmployees(query, department, countryCode, jobLevel, gender, pageable)
                .map(EmployeeDto::fromEntity);
    }

    @Transactional(readOnly = true)
    public EmployeeDto getEmployeeById(String employeeId) {
        Employee emp = employeeRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found with ID: " + employeeId));
        return EmployeeDto.fromEntity(emp);
    }

    @Transactional
    public EmployeeDto adjustSalary(String employeeId, SalaryAdjustmentRequest request) {
        Employee emp = employeeRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found with ID: " + employeeId));

        BigDecimal previousSalaryUsd = emp.getBaseSalaryUsd();
        BigDecimal newSalaryUsd = request.newBaseSalaryUsd();

        double pctChange = 0.0;
        if (previousSalaryUsd.compareTo(BigDecimal.ZERO) > 0) {
            pctChange = newSalaryUsd.subtract(previousSalaryUsd)
                    .divide(previousSalaryUsd, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
        }

        // Update local salary based on current exchange ratio
        if (previousSalaryUsd.compareTo(BigDecimal.ZERO) > 0 && emp.getBaseSalaryLocal() != null) {
            BigDecimal fxRate = emp.getBaseSalaryLocal().divide(previousSalaryUsd, 4, RoundingMode.HALF_UP);
            emp.setBaseSalaryLocal(newSalaryUsd.multiply(fxRate).setScale(2, RoundingMode.HALF_UP));
        }

        emp.setBaseSalaryUsd(newSalaryUsd);
        if (request.newBonusPercentage() != null) {
            emp.setBonusPercentage(request.newBonusPercentage());
        }
        if (request.newEquityUsd() != null) {
            emp.setEquityUsd(request.newEquityUsd());
        }

        emp.calculateDerivedFields();
        Employee saved = employeeRepository.save(emp);

        // Record audit entry
        SalaryAdjustmentLog audit = new SalaryAdjustmentLog(
                saved.getEmployeeId(),
                saved.getFullName(),
                previousSalaryUsd,
                newSalaryUsd,
                pctChange,
                request.reason(),
                request.note() != null ? request.note() : "",
                request.adjustedBy() != null ? request.adjustedBy() : "HR Manager",
                Instant.now()
        );
        auditLogRepository.save(audit);

        return EmployeeDto.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<SalaryAdjustmentLog> getRecentAuditLogs() {
        return auditLogRepository.findTop20ByOrderByTimestampDesc();
    }

    @Transactional(readOnly = true)
    public List<SalaryAdjustmentLog> getEmployeeAuditLogs(String employeeId) {
        return auditLogRepository.findByEmployeeIdOrderByTimestampDesc(employeeId);
    }

    @Transactional(readOnly = true)
    public List<String> getDepartments() {
        return employeeRepository.findDistinctDepartments();
    }

    @Transactional(readOnly = true)
    public List<String> getCountries() {
        return employeeRepository.findDistinctCountries();
    }
}
