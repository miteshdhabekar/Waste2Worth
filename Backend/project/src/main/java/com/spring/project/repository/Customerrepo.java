package com.spring.project.repository;

import com.spring.project.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.*;

public interface Customerrepo extends JpaRepository<Customer, Long> {
    boolean existsByEmail(String email);
    Optional<Customer> findByEmail(String email);
    Optional<Customer> findByEmailAndPasswordAndRole(String email, String password, String role);
    List<Customer> findByStatus(String status); // For pending NGO users
    void deleteByEmail(String email);
}
