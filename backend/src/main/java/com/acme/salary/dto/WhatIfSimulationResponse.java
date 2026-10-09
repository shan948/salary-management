package com.acme.salary.dto;

import java.math.BigDecimal;

public record WhatIfSimulationResponse(
        long impactedEmployees,
        Double percentageIncrease,
        String scopeDescription,
        BigDecimal currentPayrollUsd,
        BigDecimal projectedPayrollUsd,
        BigDecimal annualCostDeltaUsd,
        BigDecimal averageIncreasePerEmployeeUsd
) {
}
