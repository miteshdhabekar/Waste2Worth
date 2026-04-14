package com.spring.project.repository;

import com.spring.project.entity.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;

public interface DonationRepository extends JpaRepository<Donation, Long> {



    // 🟡 Get all donations by a specific donor
    List<Donation> findByCustomerEmail(String customerEmail);

    // 🟢 Total quantity of food donated
    @Query("SELECT COALESCE(SUM(d.quantity), 0) FROM Donation d")
    double getTotalQuantity();

    // 🟢 Total quantity collected today
    @Query("SELECT COALESCE(SUM(d.quantity), 0) FROM Donation d WHERE DATE(d.donationDate) = CURRENT_DATE")
    double getTodayCollectedQuantity();

    // 🟣 Get donations by status (e.g., Pending, Accepted)
    List<Donation> findByStatus(String status);

    // 🟠 Pie chart data: count grouped by is_rotten (true/false/null)
    @Query("SELECT d.isRotten, COUNT(d) FROM Donation d GROUP BY d.isRotten")
    List<Object[]> getDonationCountByType();

    // 🔵 Bar chart data: count grouped by status (Pending, Accepted, Rejected)
    @Query("SELECT d.status, COUNT(d) FROM Donation d GROUP BY d.status")
    List<Object[]> getDonationCountByStatus();


    // ✅ Add this to fix the 'countByStatus' error
    long countByStatus(String status);

    // ✅ Add this to fix the 'sumQuantityByStatus' error if you are using it
    @Query("SELECT COALESCE(SUM(d.quantity), 0) FROM Donation d WHERE d.status = :status")
    double sumQuantityByStatus(@Param("status") String status);

    // DonationRepository.java
    @Query(value = "SELECT DATE(donation_date) as date, COUNT(*) as count " +
            "FROM donation " +
            "WHERE donation_date >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) " +
            "GROUP BY DATE(donation_date)", nativeQuery = true)
    List<Map<String, Object>> getDailyDonationCounts();
}
