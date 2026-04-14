package com.spring.project.Controller;

import com.spring.project.entity.Donation;
import com.spring.project.entity.FertilizerBooking;
import com.spring.project.repository.DonationRepository;
import com.spring.project.repository.FertilizerBookingRepository;
import com.spring.project.service.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ngo")
@CrossOrigin(origins = "http://localhost:5173")
public class NgoController {

    @Autowired
    private DonationRepository donationRepo;

    @Autowired
    private FertilizerBookingRepository bookingRepo;

    @Autowired
    private MailService mailService;

    // ✅ Get all pending donations
    @GetMapping("/donations/pending")
    public List<Donation> getPendingDonations() {
        return donationRepo.findByStatus("Pending");
    }

    // ✅ Get all accepted donations
    @GetMapping("/donations/accepted")
    public List<Donation> getAcceptedDonations() {
        return donationRepo.findByStatus("Accepted");
    }

    // ✅ Accept donation and send email
    @PostMapping("/donations/accept/{id}")
    public String acceptDonation(@PathVariable Long id) {
        Donation donation = donationRepo.findById(id).orElse(null);
        if (donation != null) {
            donation.setStatus("Accepted");
            donationRepo.save(donation);
            mailService.sendDonationAcceptedEmail(donation.getCustomerEmail(), donation.getName());
            return "Donation accepted";
        }
        return "Donation not found";
    }

    // ✅ Reject donation and send email
    @PostMapping("/donations/reject/{id}")
    public String rejectDonation(@PathVariable Long id) {
        Donation donation = donationRepo.findById(id).orElse(null);
        if (donation != null) {
            donation.setStatus("Rejected");
            donationRepo.save(donation);
            mailService.sendDonationRejectedEmail(donation.getCustomerEmail(), donation.getName());
            return "Donation rejected";
        }
        return "Donation not found";
    }

    // ✅ Get all fertilizer bookings
    @GetMapping("/fertilizer-bookings")
    public List<FertilizerBooking> getFertilizerBookings() {
        return bookingRepo.findAll();
    }

    // ✅ Create a new fertilizer booking + email
    @PostMapping("/fertilizer-bookings")
    public FertilizerBooking createFertilizerBooking(@RequestBody FertilizerBooking booking) {
        FertilizerBooking saved = bookingRepo.save(booking);
        mailService.sendFertilizerBookingEmail(booking.getEmail(), booking.getCustomerName(), booking.getProductName());
        return saved;
    }
    // Add this to NgoController.java

    @GetMapping("/stats")
    public Map<String, Object> getNgoStats() {
        Map<String, Object> stats = new HashMap<>();

        // Food Stats using optimized Repository methods
        stats.put("totalDonations", donationRepo.count());
        stats.put("pendingRequests", donationRepo.countByStatus("Pending"));
        stats.put("totalFoodRescued", donationRepo.sumQuantityByStatus("Accepted"));

        // Fertilizer Stats
        stats.put("totalFertilizerOrders", bookingRepo.count());
        stats.put("totalRevenue", bookingRepo.getTotalCompletedRevenue());

        return stats;
    }
}
