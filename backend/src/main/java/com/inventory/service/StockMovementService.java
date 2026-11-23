package com.inventory.service;

import com.inventory.dto.StockMovementResponse;
import com.inventory.dto.StockRequest;
import com.inventory.entity.Product;
import com.inventory.entity.StockMovement;
import com.inventory.entity.StockMovement.MovementType;
import com.inventory.exception.InsufficientStockException;
import com.inventory.repository.StockMovementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StockMovementService {

    private final StockMovementRepository stockMovementRepository;
    private final ProductService productService;

    @Transactional
    public StockMovementResponse stockIn(Long productId, StockRequest request) {
        Product product = productService.findOrThrow(productId);
        product.setQuantity(product.getQuantity() + request.getQuantity());

        StockMovement movement = StockMovement.builder()
                .product(product)
                .movementType(MovementType.IN)
                .quantity(request.getQuantity())
                .note(request.getNote())
                .build();

        return toResponse(stockMovementRepository.save(movement));
    }

    @Transactional
    public StockMovementResponse stockOut(Long productId, StockRequest request) {
        Product product = productService.findOrThrow(productId);
        if (product.getQuantity() < request.getQuantity()) {
            throw new InsufficientStockException(product.getQuantity(), request.getQuantity());
        }
        product.setQuantity(product.getQuantity() - request.getQuantity());

        StockMovement movement = StockMovement.builder()
                .product(product)
                .movementType(MovementType.OUT)
                .quantity(request.getQuantity())
                .note(request.getNote())
                .build();

        return toResponse(stockMovementRepository.save(movement));
    }

    public List<StockMovementResponse> getHistory(Long productId) {
        productService.findOrThrow(productId);
        return stockMovementRepository.findByProductIdOrderByMovedAtDesc(productId)
                .stream().map(this::toResponse).toList();
    }

    private StockMovementResponse toResponse(StockMovement sm) {
        return StockMovementResponse.builder()
                .id(sm.getId())
                .productId(sm.getProduct().getId())
                .productName(sm.getProduct().getProductName())
                .movementType(sm.getMovementType())
                .quantity(sm.getQuantity())
                .movedAt(sm.getMovedAt())
                .note(sm.getNote())
                .build();
    }
}
