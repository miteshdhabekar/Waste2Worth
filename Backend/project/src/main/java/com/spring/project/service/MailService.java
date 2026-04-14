package com.spring.project.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    @Autowired
    private JavaMailSender mailSender;

    private static final String FROM_EMAIL = "bravo.5639672@gmail.com";

    // ✅ Registration Email
    public void sendRegistrationEmail(String toEmail, String name, String role) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Welcome to Food Bank");

        String body = "Hi " + name + ",\n\n"
                + "Thank you for registering at Food Bank.\n\n"
                + "Your email: " + toEmail + "\n"
                + "Your role: " + role + "\n\n"
                + (role.equalsIgnoreCase("NGO")
                ? "Your account is pending admin approval.\n"
                : "You can now log in and start using the system.\n")
                + "\nRegards,\nFood Bank Team";

        message.setText(body);
        message.setFrom(FROM_EMAIL);
        mailSender.send(message);
    }

    // ✅ NGO Approval Email
    public void sendApprovalEmail(String toEmail, String name) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("NGO Registration Approved");

        String body = "Dear " + name + ",\n\n"
                + "Your NGO registration has been approved!\n"
                + "You can now log in and start accepting food donations.\n\n"
                + "Regards,\nFood Bank Admin Team";

        message.setText(body);
        message.setFrom(FROM_EMAIL);
        mailSender.send(message);
    }

    // ✅ NGO Rejection Email
    public void sendRejectionEmail(String toEmail, String name) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("NGO Registration Rejected");

        String body = "Dear " + name + ",\n\n"
                + "We regret to inform you that your NGO registration has been rejected.\n\n"
                + "For any queries, please contact support.\n\n"
                + "Regards,\nFood Bank Admin Team";

        message.setText(body);
        message.setFrom(FROM_EMAIL);
        mailSender.send(message);
    }

    // ✅ Fertilizer Booking Confirmation Email
    public void sendFertilizerBookingEmail(String toEmail, String name, String productName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Fertilizer Booking Confirmed");

        String body = "Hi " + name + ",\n\n"
                + "Your fertilizer \"" + productName + "\" has been booked successfully!\n"
                + "Please pick it up from the nearest NGO center during working hours.\n\n"
                + "Thank you for supporting food waste recycling.\n"
                + "Regards,\nFood Bank Team";

        message.setText(body);
        message.setFrom(FROM_EMAIL);
        mailSender.send(message);
    }

    public void sendPaymentSuccessEmail(String toEmail, String name, String product) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Payment Verified - Order Confirmed");
        message.setText("Hi " + name + ",\n\nYour payment for " + product + " has been verified. You can now collect your item.\n\nRegards, Waste2Worth Team");
        mailSender.send(message);
    }

    public void sendPaymentRejectedEmail(String toEmail, String name, String reason) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Payment Rejected");
        message.setText("Hi " + name + ",\n\nYour payment verification failed.\nReason: " + reason + "\n\nPlease try again with a valid screenshot.");
        mailSender.send(message);
    }

    // ✅ Food Donation Accepted Email
    public void sendDonationAcceptedEmail(String toEmail, String name) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Food Donation Accepted");

        String body = "Dear " + name + ",\n\n"
                + "Your food donation has been accepted by the NGO.\n"
                + "We truly appreciate your contribution!\n\n"
                + "Regards,\nFood Bank Team";

        message.setText(body);
        message.setFrom(FROM_EMAIL);
        mailSender.send(message);
    }

    // ✅ Food Donation Rejected Email
    public void sendDonationRejectedEmail(String toEmail, String name) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Food Donation Rejected");

        String body = "Dear " + name + ",\n\n"
                + "We regret to inform you that your food donation was rejected by the NGO.\n"
                + "Please make sure the food is in acceptable condition before donating.\n\n"
                + "Regards,\nFood Bank Team";

        message.setText(body);
        message.setFrom(FROM_EMAIL);
        mailSender.send(message);
    }
}
