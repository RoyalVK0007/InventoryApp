package com.inventory.dto;

import com.inventory.entity.StockMovement.MovementType;
import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StockMovementResponse {
    private Long id;
    private Long productId;
    private String productName;
    private MovementType movementType;
    private Integer quantity;
    private LocalDateTime movedAt;
    private String note;
}
