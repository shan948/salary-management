package com.acme.salary.repository;

import com.acme.salary.model.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long>, JpaSpecificationExecutor<Employee> {

    Optional<Employee> findByEmployeeId(String employeeId);

    @Query("SELECT e FROM Employee e WHERE " +
           "(:query IS NULL OR :query = '' OR " +
           " LOWER(e.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(e.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(e.email) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(e.employeeId) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(e.jobTitle) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:department IS NULL OR :department = '' OR e.department = :department) AND " +
           "(:countryCode IS NULL OR :countryCode = '' OR e.countryCode = :countryCode) AND " +
           "(:jobLevel IS NULL OR :jobLevel = '' OR e.jobLevel = :jobLevel) AND " +
           "(:gender IS NULL OR :gender = '' OR e.gender = :gender)")
    Page<Employee> searchEmployees(
            @Param("query") String query,
            @Param("department") String department,
            @Param("countryCode") String countryCode,
            @Param("jobLevel") String jobLevel,
            @Param("gender") String gender,
            Pageable pageable
    );

    @Query("SELECT COUNT(e) FROM Employee e")
    long getTotalEmployeeCount();

    @Query("SELECT " +
           "COUNT(e), " +
           "COALESCE(SUM(e.totalCompUsd), 0), " +
           "COALESCE(SUM(e.baseSalaryUsd), 0), " +
           "COALESCE(AVG(e.baseSalaryUsd), 0), " +
           "COALESCE(MIN(e.baseSalaryUsd), 0), " +
           "COALESCE(MAX(e.baseSalaryUsd), 0), " +
           "COALESCE(AVG(e.compaRatio), 0) " +
           "FROM Employee e")
    List<Object[]> getOverallMetrics();

    @Query("SELECT " +
           "e.department, " +
           "COUNT(e), " +
           "COALESCE(AVG(e.baseSalaryUsd), 0), " +
           "COALESCE(MIN(e.baseSalaryUsd), 0), " +
           "COALESCE(MAX(e.baseSalaryUsd), 0), " +
           "COALESCE(SUM(e.totalCompUsd), 0), " +
           "COALESCE(AVG(e.compaRatio), 0) " +
           "FROM Employee e GROUP BY e.department ORDER BY AVG(e.baseSalaryUsd) DESC")
    List<Object[]> getDepartmentAnalytics();

    @Query("SELECT " +
           "e.country, " +
           "e.countryCode, " +
           "e.currency, " +
           "COUNT(e), " +
           "COALESCE(AVG(e.baseSalaryUsd), 0), " +
           "COALESCE(SUM(e.totalCompUsd), 0), " +
           "COALESCE(AVG(e.compaRatio), 0) " +
           "FROM Employee e GROUP BY e.country, e.countryCode, e.currency ORDER BY COUNT(e) DESC")
    List<Object[]> getCountryAnalytics();

    @Query("SELECT " +
           "e.jobLevel, " +
           "COUNT(e), " +
           "COALESCE(AVG(e.baseSalaryUsd), 0), " +
           "COALESCE(AVG(e.totalCompUsd), 0), " +
           "COALESCE(AVG(e.compaRatio), 0) " +
           "FROM Employee e GROUP BY e.jobLevel ORDER BY AVG(e.baseSalaryUsd) ASC")
    List<Object[]> getJobLevelAnalytics();

    @Query("SELECT " +
           "e.gender, " +
           "COUNT(e), " +
           "COALESCE(AVG(e.baseSalaryUsd), 0), " +
           "COALESCE(AVG(e.totalCompUsd), 0), " +
           "COALESCE(AVG(e.compaRatio), 0) " +
           "FROM Employee e GROUP BY e.gender")
    List<Object[]> getGenderParityAnalytics();

    @Query("SELECT " +
           "e.department, " +
           "e.gender, " +
           "COUNT(e), " +
           "COALESCE(AVG(e.baseSalaryUsd), 0) " +
           "FROM Employee e GROUP BY e.department, e.gender ORDER BY e.department")
    List<Object[]> getDepartmentGenderParity();

    @Query("SELECT COUNT(e) FROM Employee e WHERE e.compaRatio < 0.8")
    long countBelowBand();

    @Query("SELECT COUNT(e) FROM Employee e WHERE e.compaRatio >= 0.8 AND e.compaRatio <= 1.2")
    long countInBand();

    @Query("SELECT COUNT(e) FROM Employee e WHERE e.compaRatio > 1.2")
    long countAboveBand();

    @Query("SELECT DISTINCT e.department FROM Employee e ORDER BY e.department")
    List<String> findDistinctDepartments();

    @Query("SELECT DISTINCT e.country FROM Employee e ORDER BY e.country")
    List<String> findDistinctCountries();
}
