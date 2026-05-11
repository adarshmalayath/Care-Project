package com.carehome.service;

import com.carehome.dto.EnquiryRequest;
import com.carehome.model.Enquiry;
import com.carehome.model.EnquiryStats;
import com.carehome.repository.EnquiryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Enquiry service — business logic layer between controllers and repository.
 * Sends email notifications to customers on submission and admin reply.
 */
@Service
public class EnquiryService {

    private final EnquiryRepository enquiryRepository;
    private final EmailService emailService;

    public EnquiryService(EnquiryRepository enquiryRepository, EmailService emailService) {
        this.enquiryRepository = enquiryRepository;
        this.emailService = emailService;
    }

    /**
     * Submit a new service enquiry.
     * Sends a confirmation email to the customer asynchronously.
     */
    public Long submitEnquiry(EnquiryRequest request) {
        Long enquiryId = enquiryRepository.createEnquiry(
                sanitize(request.getCustomerName()),
                sanitize(request.getEmail()),
                sanitize(request.getPhone()),
                sanitize(request.getAddress()),
                sanitize(request.getServiceName()),
                request.getMessage() != null ? sanitize(request.getMessage()) : null
        );

        // Send confirmation email to customer (non-blocking)
        emailService.sendEnquiryConfirmationEmail(
                request.getEmail(),
                request.getCustomerName(),
                request.getServiceName()
        );

        return enquiryId;
    }

    /**
     * Get all enquiries (admin view).
     */
    public List<Enquiry> getAllEnquiries() {
        return enquiryRepository.findAll();
    }

    /**
     * Get enquiries filtered by status.
     */
    public List<Enquiry> getEnquiriesByStatus(String status) {
        return enquiryRepository.findByStatus(status);
    }

    /**
     * Get a single enquiry by ID.
     */
    public Optional<Enquiry> getById(Long id) {
        return enquiryRepository.findById(id);
    }

    /**
     * Admin replies to an enquiry.
     * Fetches the enquiry first to get customer email/name, then saves the reply
     * and sends an HTML email notification to the customer asynchronously.
     */
    public boolean replyToEnquiry(Long enquiryId, String reply, Long adminId) {
        // Fetch enquiry first to get customer details for email
        Optional<Enquiry> enquiryOpt = enquiryRepository.findById(enquiryId);

        String sanitisedReply = sanitize(reply);
        boolean updated = enquiryRepository.replyToEnquiry(enquiryId, sanitisedReply, adminId) > 0;

        if (updated && enquiryOpt.isPresent()) {
            Enquiry enquiry = enquiryOpt.get();
            // Send reply email to customer (non-blocking async)
            emailService.sendReplyEmail(
                    enquiry.getEmail(),
                    enquiry.getCustomerName(),
                    enquiry.getServiceName(),
                    sanitisedReply
            );
        }

        return updated;
    }

    /**
     * Admin discards an enquiry.
     */
    public boolean discardEnquiry(Long enquiryId, Long adminId) {
        return enquiryRepository.discardEnquiry(enquiryId, adminId) > 0;
    }

    /**
     * Get pending count for notification badge.
     */
    public long getPendingCount() {
        return enquiryRepository.countPending();
    }

    /**
     * Get aggregate stats for insights dashboard.
     */
    public EnquiryStats getInsights() {
        return enquiryRepository.getStats();
    }

    /**
     * Basic sanitisation — trims leading/trailing whitespace.
     * SQL injection is already prevented by PreparedStatements in the repository.
     */
    private String sanitize(String input) {
        return input == null ? null : input.trim();
    }
}
