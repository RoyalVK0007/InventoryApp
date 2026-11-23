package com.inventory.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProductResponse {
    private Long id;
    private String productName;
    private String sku;
    private String category;
    private String description;
    private Integer quantity;
    private Double price;
    private String supplier;
    private LocalDateTime createdAt;
    private String stockStatus;
}
