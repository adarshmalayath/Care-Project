package com.carehome.dto;

import jakarta.validation.constraints.*;

public class EnquiryRequest {

    @NotBlank(message = "Your name is required")
    @Size(min = 2, max = 150, message = "Name must be between 2 and 150 characters")
    private String customerName;

    @NotBlank(message = "Email address is required")
    @Email(message = "Please provide a valid email address")
    @Size(max = 150, message = "Email must not exceed 150 characters")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[+\\d\\s()-]{7,25}$", message = "Please provide a valid phone number")
    private String phone;

    @NotBlank(message = "Address is required")
    @Size(min = 5, max = 500, message = "Address must be between 5 and 500 characters")
    private String address;

    @NotBlank(message = "Service selection is required")
    private String serviceName;

    @Size(max = 2000, message = "Message must not exceed 2000 characters")
    private String message;

    public EnquiryRequest() {}

    // Getters and Setters
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
