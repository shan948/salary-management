package com.acme.salary.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;

@Entity
@Table(name = "employees", indexes = {
    @Index(name = "idx_emp_employee_id", columnList = "employeeId", unique = true),
    @Index(name = "idx_emp_department", columnList = "department"),
    @Index(name = "idx_emp_country_code", columnList = "countryCode"),
    @Index(name = "idx_emp_job_level", columnList = "jobLevel"),
    @Index(name = "idx_emp_gender", columnList = "gender"),
    @Index(name = "idx_emp_salary_usd", columnList = "baseSalaryUsd"),
    @Index(name = "idx_emp_dept_level", columnList = "department, jobLevel")
})
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 32)
    private String employeeId;

    @Column(nullable = false, length = 64)
    private String firstName;

    @Column(nullable = false, length = 64)
    private String lastName;

    @Column(nullable = false, length = 128)
    private String email;

    @Column(nullable = false, length = 20)
    private String gender;

    @Column(nullable = false, length = 64)
    private String country;

    @Column(nullable = false, length = 8)
    private String countryCode;

    @Column(nullable = false, length = 64)
    private String city;

    @Column(nullable = false, length = 64)
    private String department;

    @Column(nullable = false, length = 64)
    private String jobTitle;

    @Column(nullable = false, length = 32)
    private String jobLevel;

    @Column(nullable = false, length = 8)
    private String currency;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal baseSalaryLocal;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal baseSalaryUsd;

    @Column(nullable = false)
    private Double bonusPercentage;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal equityUsd;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal totalCompUsd;

    @Column(nullable = false)
    private Integer performanceRating;

    @Column(nullable = false)
    private Double compaRatio;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal bandMinUsd;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal bandMidUsd;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal bandMaxUsd;

    @Column(nullable = false)
    private LocalDate hireDate;

    public Employee() {
    }

    public Employee(String employeeId, String firstName, String lastName, String email, String gender,
                    String country, String countryCode, String city, String department, String jobTitle,
                    String jobLevel, String currency, BigDecimal baseSalaryLocal, BigDecimal baseSalaryUsd,
                    Double bonusPercentage, BigDecimal equityUsd, Integer performanceRating,
                    BigDecimal bandMinUsd, BigDecimal bandMidUsd, BigDecimal bandMaxUsd, LocalDate hireDate) {
        this.employeeId = employeeId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.gender = gender;
        this.country = country;
        this.countryCode = countryCode;
        this.city = city;
        this.department = department;
        this.jobTitle = jobTitle;
        this.jobLevel = jobLevel;
        this.currency = currency;
        this.baseSalaryLocal = baseSalaryLocal;
        this.baseSalaryUsd = baseSalaryUsd;
        this.bonusPercentage = bonusPercentage;
        this.equityUsd = equityUsd;
        this.performanceRating = performanceRating;
        this.bandMinUsd = bandMinUsd;
        this.bandMidUsd = bandMidUsd;
        this.bandMaxUsd = bandMaxUsd;
        this.hireDate = hireDate;
        calculateDerivedFields();
    }

    public void calculateDerivedFields() {
        if (bandMidUsd != null && bandMidUsd.compareTo(BigDecimal.ZERO) > 0 && baseSalaryUsd != null) {
            this.compaRatio = baseSalaryUsd.divide(bandMidUsd, 4, RoundingMode.HALF_UP).doubleValue();
        } else {
            this.compaRatio = 1.0;
        }

        BigDecimal bonusVal = BigDecimal.ZERO;
        if (bonusPercentage != null && bonusPercentage > 0 && baseSalaryUsd != null) {
            bonusVal = baseSalaryUsd.multiply(BigDecimal.valueOf(bonusPercentage))
                                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        }
        BigDecimal eq = (equityUsd != null) ? equityUsd : BigDecimal.ZERO;
        BigDecimal base = (baseSalaryUsd != null) ? baseSalaryUsd : BigDecimal.ZERO;
        this.totalCompUsd = base.add(bonusVal).add(eq);
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getFullName() { return firstName + " " + lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getCountryCode() { return countryCode; }
    public void setCountryCode(String countryCode) { this.countryCode = countryCode; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public String getJobLevel() { return jobLevel; }
    public void setJobLevel(String jobLevel) { this.jobLevel = jobLevel; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public BigDecimal getBaseSalaryLocal() { return baseSalaryLocal; }
    public void setBaseSalaryLocal(BigDecimal baseSalaryLocal) { this.baseSalaryLocal = baseSalaryLocal; }

    public BigDecimal getBaseSalaryUsd() { return baseSalaryUsd; }
    public void setBaseSalaryUsd(BigDecimal baseSalaryUsd) { 
        this.baseSalaryUsd = baseSalaryUsd;
        calculateDerivedFields();
    }

    public Double getBonusPercentage() { return bonusPercentage; }
    public void setBonusPercentage(Double bonusPercentage) { 
        this.bonusPercentage = bonusPercentage; 
        calculateDerivedFields();
    }

    public BigDecimal getEquityUsd() { return equityUsd; }
    public void setEquityUsd(BigDecimal equityUsd) { 
        this.equityUsd = equityUsd; 
        calculateDerivedFields();
    }

    public BigDecimal getTotalCompUsd() { return totalCompUsd; }
    public void setTotalCompUsd(BigDecimal totalCompUsd) { this.totalCompUsd = totalCompUsd; }

    public Integer getPerformanceRating() { return performanceRating; }
    public void setPerformanceRating(Integer performanceRating) { this.performanceRating = performanceRating; }

    public Double getCompaRatio() { return compaRatio; }
    public void setCompaRatio(Double compaRatio) { this.compaRatio = compaRatio; }

    public BigDecimal getBandMinUsd() { return bandMinUsd; }
    public void setBandMinUsd(BigDecimal bandMinUsd) { this.bandMinUsd = bandMinUsd; }

    public BigDecimal getBandMidUsd() { return bandMidUsd; }
    public void setBandMidUsd(BigDecimal bandMidUsd) { 
        this.bandMidUsd = bandMidUsd; 
        calculateDerivedFields();
    }

    public BigDecimal getBandMaxUsd() { return bandMaxUsd; }
    public void setBandMaxUsd(BigDecimal bandMaxUsd) { this.bandMaxUsd = bandMaxUsd; }

    public LocalDate getHireDate() { return hireDate; }
    public void setHireDate(LocalDate hireDate) { this.hireDate = hireDate; }
}
