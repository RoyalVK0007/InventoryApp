package com.inventory.controller;

import com.inventory.dto.DashboardSummary;
import com.inventory.dto.ProductResponse;
import com.inventory.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummary> summary() {
        return ResponseEntity.ok(dashboardService.getSummary());
    }

    @GetMapping("/recent-products")
    public ResponseEntity<List<ProductResponse>> recentProducts() {
        return ResponseEntity.ok(dashboardService.getRecentProducts());
    }
}
