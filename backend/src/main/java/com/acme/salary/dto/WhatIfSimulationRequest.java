package com.acme.salary.dto;

import java.math.BigDecimal;

public record WhatIfSimulationRequest(
        Double percentageIncrease,
        String department,
        String countryCode,
        String jobLevel
) {
}
