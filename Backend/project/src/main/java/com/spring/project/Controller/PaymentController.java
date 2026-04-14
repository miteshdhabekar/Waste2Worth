package com.spring.project.Controller;

import com.spring.project.entity.FertilizerBooking;
import com.spring.project.repository.FertilizerBookingRepository;
import com.spring.project.service.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
        import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.File;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    @Autowired private FertilizerBookingRepository bookingRepo;
    @Autowired private MailService mailService;

    private final String uploadDir = System.getProperty("user.dir") + "/uploads/screenshots";

    // ── STEP 1: Place order (no payment yet) ─────────────────────────────────
    @PostMapping("/place-order")
    public ResponseEntity<Map<String, Object>> placeOrder(@RequestBody Map<String, Object> req) {
        try {
            FertilizerBooking booking = new FertilizerBooking();
            booking.setCustomerName((String) req.get("customerName"));
            booking.setEmail((String) req.get("email"));
            booking.setPhone((String) req.get("phone"));
            booking.setAddress((String) req.get("address"));
            booking.setProductName((String) req.get("productName"));
            booking.setQuantity(Integer.parseInt(req.get("quantity").toString()));
            booking.setTotalPrice(Double.parseDouble(req.get("totalPrice").toString()));
            booking.setPaymentStatus("PENDING_PAYMENT");
            booking.setCreatedAt(LocalDateTime.now());

            FertilizerBooking saved = bookingRepo.save(booking);
            return ResponseEntity.ok(Map.of("success", true, "bookingId", saved.getId(), "totalPrice", saved.getTotalPrice()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    // ── STEP 2: Upload payment screenshot ────────────────────────────────────
    @PostMapping("/upload-screenshot")
    public ResponseEntity<Map<String, Object>> uploadScreenshot(
            @RequestParam("bookingId") Long bookingId,
            @RequestParam("utrNumber") String utrNumber,
            @RequestParam("screenshot") MultipartFile screenshot) {
        try {
            Optional<FertilizerBooking> opt = bookingRepo.findById(bookingId);
            if (opt.isEmpty()) return ResponseEntity.badRequest().body(Map.of("success", false, "error", "Booking not found"));

            FertilizerBooking booking = opt.get();

            // Save screenshot file
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            String ext = StringUtils.getFilenameExtension(screenshot.getOriginalFilename());
            String fileName = "pay_" + bookingId + "_" + System.currentTimeMillis() + "." + ext;
            File dest = new File(uploadDir + File.separator + fileName);
            screenshot.transferTo(dest);

            String screenshotUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/uploads/screenshots/")
                    .path(fileName)
                    .toUriString();

            booking.setScreenshotUrl(screenshotUrl);
            booking.setUtrNumber(utrNumber);
            booking.setPaymentStatus("PENDING_VERIFICATION");
            bookingRepo.save(booking);

            return ResponseEntity.ok(Map.of("success", true, "message", "Screenshot uploaded. Awaiting verification."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    // ── STEP 3a: Admin/NGO verify payment ────────────────────────────────────
    @PostMapping("/verify/{id}")
    public ResponseEntity<Map<String, Object>> verifyPayment(
            @PathVariable Long id,
            @RequestBody Map<String, String> req) {
        try {
            Optional<FertilizerBooking> opt = bookingRepo.findById(id);
            if (opt.isEmpty()) return ResponseEntity.badRequest().body(Map.of("success", false, "error", "Booking not found"));

            FertilizerBooking booking = opt.get();
            booking.setPaymentStatus("VERIFIED");
            booking.setVerifiedBy(req.getOrDefault("verifiedBy", "Admin"));
            booking.setVerifiedAt(LocalDateTime.now());
            bookingRepo.save(booking);

            // Send confirmation email to customer
            mailService.sendFertilizerBookingEmail(booking.getEmail(), booking.getCustomerName(), booking.getProductName());

            return ResponseEntity.ok(Map.of("success", true, "message", "Payment verified successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    // ── STEP 3b: Admin/NGO reject payment ────────────────────────────────────
    @PostMapping("/reject/{id}")
    public ResponseEntity<Map<String, Object>> rejectPayment(
            @PathVariable Long id,
            @RequestBody Map<String, String> req) {
        try {
            Optional<FertilizerBooking> opt = bookingRepo.findById(id);
            if (opt.isEmpty()) return ResponseEntity.badRequest().body(Map.of("success", false, "error", "Booking not found"));

            FertilizerBooking booking = opt.get();
            booking.setPaymentStatus("REJECTED");
            booking.setRejectionReason(req.getOrDefault("reason", "Payment could not be verified"));
            booking.setVerifiedBy(req.getOrDefault("verifiedBy", "Admin"));
            booking.setVerifiedAt(LocalDateTime.now());
            bookingRepo.save(booking);

            return ResponseEntity.ok(Map.of("success", true, "message", "Payment rejected"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    // ── GET: All bookings pending verification (for admin/NGO) ───────────────
    @GetMapping("/pending-verification")
    public ResponseEntity<List<FertilizerBooking>> getPendingVerification() {
        return ResponseEntity.ok(bookingRepo.findByPaymentStatus("PENDING_VERIFICATION"));
    }

    // ── GET: All bookings (for admin) ────────────────────────────────────────
    @GetMapping("/all-bookings")
    public ResponseEntity<List<FertilizerBooking>> getAllBookings() {
        return ResponseEntity.ok(bookingRepo.findAll());
    }

    // ── GET: Payment history by user email ───────────────────────────────────
    @GetMapping("/history/{email}")
    public ResponseEntity<List<FertilizerBooking>> getHistory(@PathVariable String email) {
        return ResponseEntity.ok(bookingRepo.findByEmail(email));
    }
}
