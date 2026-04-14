package com.spring.project.Controller;

import com.spring.project.entity.Customer;
import com.spring.project.repository.Customerrepo;
import com.spring.project.service.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class RegisterController {

    @Autowired
    private Customerrepo customerrepo;

    @Autowired
    private MailService mailService;

    @PostMapping("/register")
    public String registerUser(@RequestBody Customer customer) {
        if (customerrepo.existsByEmail(customer.getEmail())) {
            return "Email already exists.";
        }

        // Set default status
        if ("NGO".equalsIgnoreCase(customer.getRole())) {
            customer.setStatus("PENDING");
        } else {
            customer.setStatus("APPROVED");
        }

        customerrepo.save(customer);

        mailService.sendRegistrationEmail(
                customer.getEmail(),
                customer.getName(),
                customer.getRole()
        );

        if ("NGO".equalsIgnoreCase(customer.getRole())) {
            return "NGO registered. Waiting for admin approval. Email sent.";
        } else {
            return "User registered successfully. Email sent.";
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Customer request) {
        Optional<Customer> customerOpt = customerrepo.findByEmailAndPasswordAndRole(
                request.getEmail(),
                request.getPassword(),
                request.getRole()
        );

        if (customerOpt.isPresent()) {
            Customer customer = customerOpt.get();

            if ("NGO".equalsIgnoreCase(customer.getRole()) &&
                    "PENDING".equalsIgnoreCase(customer.getStatus())) {
                return ResponseEntity
                        .badRequest()
                        .body("NGO registration is pending. Please wait for admin approval.");
            }

            // ✅ Prepare success response
            Map<String, Object> response = new HashMap<>();
            response.put("token", "dummy-token"); // Add JWT later if needed
            response.put("name", customer.getName());
            response.put("role", customer.getRole().toLowerCase());

            return ResponseEntity.ok(response);
        }

        return ResponseEntity.badRequest().body("Invalid credentials");
    }


    // ✅ Get profile by email
    @GetMapping("/profile/{email}")
    public ResponseEntity<?> getProfile(@PathVariable String email) {
        Optional<Customer> customer = customerrepo.findByEmail(email);
        return customer.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ✅ Update profile
    @PutMapping("/profile/update")
    public ResponseEntity<?> updateProfile(@RequestBody Customer updatedCustomer) {
        Optional<Customer> existing = customerrepo.findByEmail(updatedCustomer.getEmail());

        if (existing.isPresent()) {
            Customer customer = existing.get();
            customer.setName(updatedCustomer.getName());

            if (updatedCustomer.getPassword() != null && !updatedCustomer.getPassword().isEmpty()) {
                customer.setPassword(updatedCustomer.getPassword());
            }

            customerrepo.save(customer);
            return ResponseEntity.ok(customer);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
