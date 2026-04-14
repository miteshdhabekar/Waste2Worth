package com.spring.project.Controller;

import com.spring.project.entity.FertilizerBooking;
import com.spring.project.repository.FertilizerBookingRepository;
import com.spring.project.service.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class FertilizerBookingController {

    @Autowired
    private FertilizerBookingRepository bookingRepository;

    @Autowired
    private MailService mailService;

    // Use a path that is easily accessible to the server
    private final String UPLOAD_DIR = "uploads/payments/";

    @PostMapping("/submit")
    public ResponseEntity<?> submitBooking(
            @RequestParam("customerName") String name,
            @RequestParam("email") String email,
            @RequestParam("phone") String phone,
            @RequestParam("address") String address,
            @RequestParam("productName") String productName,
            @RequestParam("quantity") int quantity,
            @RequestParam("totalPrice") double totalPrice,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        try {
            // 1. Initialize directory
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            FertilizerBooking booking = new FertilizerBooking();
            booking.setCustomerName(name);
            booking.setEmail(email);
            booking.setPhone(phone);
            booking.setAddress(address);
            booking.setProductName(productName);
            booking.setQuantity(quantity);
            booking.setTotalPrice(totalPrice);
            booking.setCreatedAt(LocalDateTime.now()); // Manual set if DB default isn't picking up

            // 2. Handle Screenshot Upload
            if (image != null && !image.isEmpty()) {
                String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
                Path filePath = Paths.get(UPLOAD_DIR + fileName);
                Files.write(filePath, image.getBytes());

                // Store relative path for the frontend
                booking.setScreenshotUrl("/uploads/payments/" + fileName);
                booking.setPaymentStatus("PENDING_VERIFICATION");
            } else {
                booking.setPaymentStatus("PENDING_PAYMENT");
            }

            // 3. Save and Email
            bookingRepository.save(booking);
            mailService.sendFertilizerBookingEmail(email, name, productName);

            return ResponseEntity.ok("Order submitted. Status: " + booking.getPaymentStatus());

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Upload failed: " + e.getMessage());
        }
    }
}