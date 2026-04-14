package com.spring.project.service;

import java.util.List;

import com.spring.project.entity.Customer;

public interface Loginservice_1 {

List<Customer> getAllCustomers();
Customer Savecustomer(Customer Customer);
Customer findByEmailAndPassword(String email, String Password,String role);
Customer updateCustomer(Customer customer);
}
