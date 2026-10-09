package com.acme.salary.controller;

import com.acme.salary.dto.EmployeeDto;
import com.acme.salary.dto.SalaryAdjustmentRequest;
import com.acme.salary.model.SalaryAdjustmentLog;
import com.acme.salary.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    public ResponseEntity<Page<EmployeeDto>> getEmployees(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String countryCode,
            @RequestParam(required = false) String jobLevel,
            @RequestParam(required = false) String gender,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "baseSalaryUsd") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, Math.min(size, 100), sort);
        Page<EmployeeDto> result = employeeService.searchEmployees(query, department, countryCode, jobLevel, gender, pageable);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{employeeId}")
    public ResponseEntity<EmployeeDto> getEmployee(@PathVariable String employeeId) {
        return ResponseEntity.ok(employeeService.getEmployeeById(employeeId));
    }

    @PostMapping("/{employeeId}/adjust")
    public ResponseEntity<EmployeeDto> adjustSalary(
            @PathVariable String employeeId,
            @Valid @RequestBody SalaryAdjustmentRequest request
    ) {
        EmployeeDto updated = employeeService.adjustSalary(employeeId, request);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{employeeId}/audit")
    public ResponseEntity<List<SalaryAdjustmentLog>> getEmployeeAudit(@PathVariable String employeeId) {
        return ResponseEntity.ok(employeeService.getEmployeeAuditLogs(employeeId));
    }

    @GetMapping("/audit")
    public ResponseEntity<List<SalaryAdjustmentLog>> getRecentAudit() {
        return ResponseEntity.ok(employeeService.getRecentAuditLogs());
    }

    @GetMapping("/departments")
    public ResponseEntity<List<String>> getDepartments() {
        return ResponseEntity.ok(employeeService.getDepartments());
    }

    @GetMapping("/countries")
    public ResponseEntity<List<String>> getCountries() {
        return ResponseEntity.ok(employeeService.getCountries());
    }
}
