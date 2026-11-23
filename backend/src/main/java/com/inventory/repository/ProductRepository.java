package com.inventory.repository;

import com.inventory.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    boolean existsBySku(String sku);

    boolean existsBySkuAndIdNot(String sku, Long id);

    Optional<Product> findBySku(String sku);

    @Query("SELECT p FROM Product p WHERE LOWER(p.productName) LIKE LOWER(CONCAT('%',:kw,'%')) OR LOWER(p.sku) LIKE LOWER(CONCAT('%',:kw,'%'))")
    List<Product> searchByKeyword(@Param("kw") String keyword);

    List<Product> findByCategory(String category);

    List<Product> findByQuantityLessThan(int threshold);

    List<Product> findByQuantity(int quantity);

    List<Product> findTop10ByOrderByCreatedAtDesc();
}
