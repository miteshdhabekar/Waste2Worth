package com.spring.project.repository;

import com.spring.project.entity.FertilizerBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface FertilizerBookingRepository extends JpaRepository<FertilizerBooking, Long> {

    // Logic for Admin Payment Tabs
    List<FertilizerBooking> findByPaymentStatus(String status);

    // Logic for User Order History
    List<FertilizerBooking> findByEmail(String email);

    // Leaderboard Data
    @Query(value = "SELECT customer_name as name, email, SUM(total_price) as totalSpent, " +
            "COUNT(*) as orderCount, SUM(quantity) as totalKg " +
            "FROM fertilizer_booking " +
            "WHERE payment_status = 'COMPLETED' " +
            "GROUP BY email, customer_name " +
            "ORDER BY totalSpent DESC LIMIT 10", nativeQuery = true)
    List<Map<String, Object>> getTopBuyers();

    // 1. Summary: Only COMPLETED orders
    @Query(value = "SELECT " +
            "COALESCE(SUM(total_price), 0) as totalRevenue, " +
            "COUNT(*) as totalOrders, " +
            "COALESCE(AVG(total_price), 0) as avgOrderValue, " +
            "(SELECT product_name FROM fertilizer_booking WHERE payment_status = 'COMPLETED' GROUP BY product_name ORDER BY COUNT(*) DESC LIMIT 1) as topProduct " +
            "FROM fertilizer_booking WHERE payment_status = 'COMPLETED'", nativeQuery = true)
    Map<String, Object> getSalesSummary();

    // 2. Monthly Trend: Filtered by COMPLETED
    @Query(value = "SELECT DATE_FORMAT(created_at, '%b %Y') as month, SUM(total_price) as revenue " +
            "FROM fertilizer_booking WHERE payment_status = 'COMPLETED' " +
            "GROUP BY month ORDER BY MAX(created_at) ASC", nativeQuery = true)
    List<Map<String, Object>> getMonthlyRevenue();

    // 3. Product Distribution: Filtered by COMPLETED
    @Query(value = "SELECT product_name as productName, SUM(total_price) as revenue " +
            "FROM fertilizer_booking WHERE payment_status = 'COMPLETED' " +
            "GROUP BY product_name", nativeQuery = true)
    List<Map<String, Object>> getProductSales();

    // 4. Daily Trend: Filtered by COMPLETED
    @Query(value = "SELECT DATE(created_at) as date, COUNT(*) as orders " +
            "FROM fertilizer_booking WHERE payment_status = 'COMPLETED' " +
            "AND created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) " +
            "GROUP BY DATE(created_at) ORDER BY date ASC", nativeQuery = true)
    List<Map<String, Object>> getDailyTrend();

    // ✅ Add this to fix 'getTotalCompletedRevenue'
    @Query("SELECT COALESCE(SUM(b.totalPrice), 0) FROM FertilizerBooking b WHERE b.paymentStatus = 'COMPLETED'")
    double getTotalCompletedRevenue();
}