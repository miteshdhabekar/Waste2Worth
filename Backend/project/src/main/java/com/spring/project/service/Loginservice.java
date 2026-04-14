//package com.spring.project.service;
//
//import java.util.List;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import com.spring.project.entity.Customer;
//import com.spring.project.repository.Customerrepo;
//
//@Service
//public class Loginservice implements Loginservice_1 {
//
//	@Autowired
//	private Customerrepo customerrepo; 
//	
//	@Override
//	public List<Customer> getAllCustomers() {
//		return(List<Customer>) customerrepo.findAll();
//		
//	}
//
//	@Override
//	public Customer Savecustomer(Customer Customer) {
//		// TODO Auto-generated method stub
//		return customerrepo.save(Customer) ;
//	}
//
//	@Override
//	public Customer findByEmailAndPassword(String email,String Password,String role) {
//	return customerrepo.findByEmailAndPassword(email, Password);
//	}
//
//	@Override
//	public Customer updateCustomer(Customer customer) {
//		// TODO Auto-generated method stub
//		return customerrepo.save(customer) ;
//	}
//
//	
//}
