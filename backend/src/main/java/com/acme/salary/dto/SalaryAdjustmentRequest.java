package com.acme.salary.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record SalaryAdjustmentRequest(
        @NotNull(message = "New base salary USD is required")
        @DecimalMin(value = "1000.00", message = "Base salary must be at least 1,000 USD")
        BigDecimal newBaseSalaryUsd,

        Double newBonusPercentage,

        BigDecimal newEquityUsd,

        @NotBlank(message = "Adjustment reason is required")
        String reason,

        String note,

        String adjustedBy
) {
}
