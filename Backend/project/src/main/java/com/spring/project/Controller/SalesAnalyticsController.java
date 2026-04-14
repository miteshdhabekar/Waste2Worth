package com.spring.project.Controller;

import com.spring.project.repository.FertilizerBookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ngo/analytics")
@CrossOrigin(origins = "http://localhost:5173")
public class SalesAnalyticsController {

    @Autowired
    private FertilizerBookingRepository bookingRepository;

    @GetMapping("/summary")
    public Map<String, Object> getSummary() { return bookingRepository.getSalesSummary(); }

    @GetMapping("/monthly-revenue")
    public List<Map<String, Object>> getMonthly() { return bookingRepository.getMonthlyRevenue(); }

    @GetMapping("/product-sales")
    public List<Map<String, Object>> getProducts() { return bookingRepository.getProductSales(); }

    @GetMapping("/daily-trend")
    public List<Map<String, Object>> getDaily() { return bookingRepository.getDailyTrend(); }
}