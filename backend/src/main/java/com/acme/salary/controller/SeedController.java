package com.acme.salary.controller;

import com.acme.salary.service.SeedDataService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/seed")
public class SeedController {

    private final SeedDataService seedDataService;

    public SeedController(SeedDataService seedDataService) {
        this.seedDataService = seedDataService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> seedData(@RequestParam(defaultValue = "10000") int count) {
        int seeded = seedDataService.seedDatabase(count);
        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "message", "Seeded " + seeded + " employee records",
                "totalCount", seeded
        ));
    }
}
