package com.spring.project.Controller;

import com.spring.project.entity.Donation;
import com.spring.project.repository.DonationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.UUID;
import java.util.*;
@RestController
@RequestMapping("/api/donations")
@CrossOrigin(origins = "http://localhost:5173")
public class DonationController {

    @Autowired
    private DonationRepository donationRepository;

    private final String uploadDir = System.getProperty("user.dir") + "/uploads";
    
    
    @GetMapping("/history/{email}")
    public ResponseEntity<List<Donation>> getDonationHistory(@PathVariable String email) {
        try {
            List<Donation> donations = donationRepository.findByCustomerEmail(email);
            return ResponseEntity.ok(donations);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @PostMapping("/submit")
    public ResponseEntity<String> submitDonation(
            @RequestParam("name") String name,
            @RequestParam("customerEmail") String customerEmail,
            @RequestParam("foodType") String foodType,
            @RequestParam("quantity") int quantity,
            @RequestParam("address") String address,
            @RequestParam("foodDetails") String foodDetails,
            @RequestParam("latitude") double latitude,
            @RequestParam("longitude") double longitude,
            @RequestParam("donationDate") String donationDate,
            @RequestParam(value = "image", required = false) MultipartFile imageFile
    ) {
        try {
            String imageUrl = null;

            // Upload image if provided
            if (imageFile != null && !imageFile.isEmpty()) {
                File dir = new File(uploadDir);
                if (!dir.exists()) dir.mkdirs();

                String fileExtension = StringUtils.getFilenameExtension(imageFile.getOriginalFilename());
                String fileName = UUID.randomUUID().toString() + "." + fileExtension;
                File dest = new File(uploadDir + File.separator + fileName);
                imageFile.transferTo(dest);

                imageUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                        .path("/uploads/")
                        .path(fileName)
                        .toUriString();
            }

            // Convert date with Z format to LocalDateTime
            LocalDateTime parsedDate = OffsetDateTime.parse(donationDate).toLocalDateTime();

            // Create donation object and map values
            Donation donation = new Donation();
            donation.setName(name);
            donation.setCustomerEmail(customerEmail);
            donation.setFoodType(foodType);
            donation.setQuantity(quantity);
            donation.setAddress(address);
            donation.setFoodDetails(foodDetails);
            donation.setLatitude(latitude);
            donation.setLongitude(longitude);
            donation.setDonationDate(parsedDate);
            donation.setImageUrl(imageUrl);
            donation.setStatus("Pending");

            donationRepository.save(donation);

            return ResponseEntity.ok("Donation submitted successfully.");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving donation.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid input: " + e.getMessage());
        }
    }
}
