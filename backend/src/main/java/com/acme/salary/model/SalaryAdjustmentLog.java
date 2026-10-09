package com.acme.salary.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "salary_adjustment_logs", indexes = {
    @Index(name = "idx_adj_employee_id", columnList = "employeeId"),
    @Index(name = "idx_adj_timestamp", columnList = "timestamp")
})
public class SalaryAdjustmentLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 32)
    private String employeeId;

    @Column(nullable = false)
    private String employeeName;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal previousSalaryUsd;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal newSalaryUsd;

    @Column(nullable = false)
    private Double percentageChange;

    @Column(nullable = false, length = 64)
    private String reason;

    @Column(length = 255)
    private String note;

    @Column(nullable = false, length = 64)
    private String adjustedBy;

    @Column(nullable = false)
    private Instant timestamp;

    public SalaryAdjustmentLog() {
    }

    public SalaryAdjustmentLog(String employeeId, String employeeName, BigDecimal previousSalaryUsd,
                               BigDecimal newSalaryUsd, Double percentageChange, String reason,
                               String note, String adjustedBy, Instant timestamp) {
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.previousSalaryUsd = previousSalaryUsd;
        this.newSalaryUsd = newSalaryUsd;
        this.percentageChange = percentageChange;
        this.reason = reason;
        this.note = note;
        this.adjustedBy = adjustedBy;
        this.timestamp = timestamp;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public BigDecimal getPreviousSalaryUsd() { return previousSalaryUsd; }
    public void setPreviousSalaryUsd(BigDecimal previousSalaryUsd) { this.previousSalaryUsd = previousSalaryUsd; }

    public BigDecimal getNewSalaryUsd() { return newSalaryUsd; }
    public void setNewSalaryUsd(BigDecimal newSalaryUsd) { this.newSalaryUsd = newSalaryUsd; }

    public Double getPercentageChange() { return percentageChange; }
    public void setPercentageChange(Double percentageChange) { this.percentageChange = percentageChange; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public String getAdjustedBy() { return adjustedBy; }
    public void setAdjustedBy(String adjustedBy) { this.adjustedBy = adjustedBy; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
}
