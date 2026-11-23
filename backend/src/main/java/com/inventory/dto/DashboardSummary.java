package com.inventory.dto;

import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DashboardSummary {
    private long totalProducts;
    private long totalStockQuantity;
    private long lowStockCount;
    private long outOfStockCount;
    private List<ProductResponse> lowStockProducts;
}
