package com.inventory;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.datasource.username=sa",
    "spring.datasource.password=",
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect",
    "google.client.id=test-client-id",
    "jwt.secret=test-secret-key-that-is-long-enough-for-hmac-sha256-algorithm",
    "jwt.expiration.ms=86400000"
})
class InventoryApplicationTests {

    @Test
    void contextLoads() {
    }
}
