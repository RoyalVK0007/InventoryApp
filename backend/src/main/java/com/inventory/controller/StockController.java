package com.inventory.controller;

import com.inventory.dto.StockMovementResponse;
import com.inventory.dto.StockRequest;
import com.inventory.service.StockMovementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products/{id}/stock")
@RequiredArgsConstructor
public class StockController {

    private final StockMovementService stockMovementService;

    @PostMapping("/in")
    public ResponseEntity<StockMovementResponse> stockIn(@PathVariable Long id,
                                                          @Valid @RequestBody StockRequest request) {
        return ResponseEntity.ok(stockMovementService.stockIn(id, request));
    }

    @PostMapping("/out")
    public ResponseEntity<StockMovementResponse> stockOut(@PathVariable Long id,
                                                           @Valid @RequestBody StockRequest request) {
        return ResponseEntity.ok(stockMovementService.stockOut(id, request));
    }

    @GetMapping("/history")
    public ResponseEntity<List<StockMovementResponse>> history(@PathVariable Long id) {
        return ResponseEntity.ok(stockMovementService.getHistory(id));
    }
}
