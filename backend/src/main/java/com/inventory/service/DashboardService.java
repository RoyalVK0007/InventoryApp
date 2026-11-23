package com.inventory.service;

import com.inventory.dto.DashboardSummary;
import com.inventory.dto.ProductResponse;
import com.inventory.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private static final int LOW_STOCK_THRESHOLD = 10;

    private final ProductRepository productRepository;
    private final ProductService productService;

    public DashboardSummary getSummary() {
        long total = productRepository.count();
        long totalQty = productRepository.findAll().stream()
                .mapToLong(p -> p.getQuantity()).sum();
        long lowStock = productRepository.findByQuantityLessThan(LOW_STOCK_THRESHOLD).stream()
                .filter(p -> p.getQuantity() > 0).count();
        long outOfStock = productRepository.findByQuantity(0).size();

        List<ProductResponse> lowStockProducts = productRepository
                .findByQuantityLessThan(LOW_STOCK_THRESHOLD).stream()
                .filter(p -> p.getQuantity() > 0)
                .map(productService::toResponse)
                .toList();

        return DashboardSummary.builder()
                .totalProducts(total)
                .totalStockQuantity(totalQty)
                .lowStockCount(lowStock)
                .outOfStockCount(outOfStock)
                .lowStockProducts(lowStockProducts)
                .build();
    }

    public List<ProductResponse> getRecentProducts() {
        return productRepository.findTop10ByOrderByCreatedAtDesc()
                .stream().map(productService::toResponse).toList();
    }
}
