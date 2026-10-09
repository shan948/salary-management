package com.acme.salary.repository;

import com.acme.salary.model.SalaryAdjustmentLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SalaryAdjustmentLogRepository extends JpaRepository<SalaryAdjustmentLog, Long> {
    List<SalaryAdjustmentLog> findTop20ByOrderByTimestampDesc();
    List<SalaryAdjustmentLog> findByEmployeeIdOrderByTimestampDesc(String employeeId);
}
