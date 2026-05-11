package com.carehome.model;

import java.time.LocalDateTime;

public class Enquiry {
    private Long enquiryId;
    private String customerName;
    private String email;
    private String phone;
    private String address;
    private String serviceName;
    private String message;
    private String status;
    private String adminReply;
    private Long repliedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Enquiry() {}

    // Getters and Setters
    public Long getEnquiryId() { return enquiryId; }
    public void setEnquiryId(Long enquiryId) { this.enquiryId = enquiryId; }

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

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAdminReply() { return adminReply; }
    public void setAdminReply(String adminReply) { this.adminReply = adminReply; }

    public Long getRepliedBy() { return repliedBy; }
    public void setRepliedBy(Long repliedBy) { this.repliedBy = repliedBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
