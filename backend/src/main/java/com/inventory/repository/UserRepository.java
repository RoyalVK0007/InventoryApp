package com.inventory.repository;

import com.inventory.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByGoogleSubject(String googleSubject);
    Optional<AppUser> findByEmail(String email);
}
