package com.inventory.service;

import com.inventory.dto.ProductRequest;
import com.inventory.dto.ProductResponse;
import com.inventory.entity.Product;
import com.inventory.exception.DuplicateSkuException;
import com.inventory.exception.ResourceNotFoundException;
import com.inventory.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private static final int LOW_STOCK_THRESHOLD = 10;

    private final ProductRepository productRepository;

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        if (productRepository.existsBySku(request.getSku())) {
            throw new DuplicateSkuException(request.getSku());
        }
        Product product = Product.builder()
                .productName(request.getProductName())
                .sku(request.getSku())
                .category(request.getCategory())
                .description(request.getDescription())
                .quantity(request.getQuantity())
                .price(request.getPrice())
                .supplier(request.getSupplier())
                .build();
        return toResponse(productRepository.save(product));
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream().map(this::toResponse).toList();
    }

    public ProductResponse getProductById(Long id) {
        return toResponse(findOrThrow(id));
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = findOrThrow(id);
        if (productRepository.existsBySkuAndIdNot(request.getSku(), id)) {
            throw new DuplicateSkuException(request.getSku());
        }
        product.setProductName(request.getProductName());
        product.setSku(request.getSku());
        product.setCategory(request.getCategory());
        product.setDescription(request.getDescription());
        product.setQuantity(request.getQuantity());
        product.setPrice(request.getPrice());
        product.setSupplier(request.getSupplier());
        return toResponse(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    public List<ProductResponse> searchProducts(String keyword) {
        return productRepository.searchByKeyword(keyword).stream().map(this::toResponse).toList();
    }

    public List<ProductResponse> getByCategory(String category) {
        return productRepository.findByCategory(category).stream().map(this::toResponse).toList();
    }

    public List<ProductResponse> getLowStockProducts() {
        return productRepository.findByQuantityLessThan(LOW_STOCK_THRESHOLD).stream().map(this::toResponse).toList();
    }

    public List<ProductResponse> getOutOfStockProducts() {
        return productRepository.findByQuantity(0).stream().map(this::toResponse).toList();
    }

    public Product findOrThrow(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    public ProductResponse toResponse(Product p) {
        String status;
        if (p.getQuantity() == 0) status = "OUT_OF_STOCK";
        else if (p.getQuantity() < LOW_STOCK_THRESHOLD) status = "LOW_STOCK";
        else status = "IN_STOCK";

        return ProductResponse.builder()
                .id(p.getId())
                .productName(p.getProductName())
                .sku(p.getSku())
                .category(p.getCategory())
                .description(p.getDescription())
                .quantity(p.getQuantity())
                .price(p.getPrice())
                .supplier(p.getSupplier())
                .createdAt(p.getCreatedAt())
                .stockStatus(status)
                .build();
    }
}
