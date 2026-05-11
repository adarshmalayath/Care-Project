package com.carehome.controller;

import com.carehome.dto.LoginRequest;
import com.carehome.dto.LoginResponse;
import com.carehome.dto.ReplyRequest;
import com.carehome.model.Enquiry;
import com.carehome.model.EnquiryStats;
import com.carehome.repository.AdminRepository;
import com.carehome.service.AdminService;
import com.carehome.service.EnquiryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Admin portal REST controller.
 * - POST /api/admin/login     — public (returns JWT)
 * - All other endpoints       — require valid JWT (ROLE_ADMIN)
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final EnquiryService enquiryService;
    private final AdminRepository adminRepository;

    public AdminController(AdminService adminService,
                           EnquiryService enquiryService,
                           AdminRepository adminRepository) {
        this.adminService = adminService;
        this.enquiryService = enquiryService;
        this.adminRepository = adminRepository;
    }

    /**
     * Admin login — returns JWT token on success.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = adminService.authenticate(request);
        if (response == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "Invalid username or password."));
        }
        return ResponseEntity.ok(Map.of("success", true, "data", response));
    }

    /**
     * Get all enquiries with optional status filter.
     * GET /api/admin/enquiries?status=PENDING
     */
    @GetMapping("/enquiries")
    public ResponseEntity<Map<String, Object>> getEnquiries(
            @RequestParam(required = false) String status) {
        List<Enquiry> enquiries = (status != null && !status.isBlank())
                ? enquiryService.getEnquiriesByStatus(status.toUpperCase())
                : enquiryService.getAllEnquiries();
        long pendingCount = enquiryService.getPendingCount();
        return ResponseEntity.ok(Map.of(
                "success", true,
                "enquiries", enquiries,
                "pendingCount", pendingCount,
                "total", enquiries.size()
        ));
    }

    /**
     * Get single enquiry by ID.
     */
    @GetMapping("/enquiries/{id}")
    public ResponseEntity<?> getEnquiry(@PathVariable Long id) {
        Optional<Enquiry> enquiry = enquiryService.getById(id);
        if (enquiry.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "Enquiry not found."));
        }
        return ResponseEntity.ok(Map.of("success", true, "enquiry", enquiry.get()));
    }

    /**
     * Reply to an enquiry.
     */
    @PutMapping("/enquiries/{id}/reply")
    public ResponseEntity<Map<String, Object>> replyToEnquiry(
            @PathVariable Long id,
            @Valid @RequestBody ReplyRequest request,
            Authentication authentication) {
        Long adminId = getAdminId(authentication);
        boolean updated = enquiryService.replyToEnquiry(id, request.getReply(), adminId);
        if (!updated) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "Enquiry not found."));
        }
        return ResponseEntity.ok(Map.of("success", true, "message", "Reply sent successfully."));
    }

    /**
     * Discard an enquiry.
     */
    @PutMapping("/enquiries/{id}/discard")
    public ResponseEntity<Map<String, Object>> discardEnquiry(
            @PathVariable Long id,
            Authentication authentication) {
        Long adminId = getAdminId(authentication);
        boolean updated = enquiryService.discardEnquiry(id, adminId);
        if (!updated) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "Enquiry not found."));
        }
        return ResponseEntity.ok(Map.of("success", true, "message", "Enquiry discarded."));
    }

    /**
     * Get insights dashboard data.
     */
    @GetMapping("/insights")
    public ResponseEntity<Map<String, Object>> getInsights() {
        EnquiryStats stats = enquiryService.getInsights();
        return ResponseEntity.ok(Map.of("success", true, "stats", stats));
    }

    /**
     * Get pending enquiry count (for notification badge polling).
     */
    @GetMapping("/notifications/count")
    public ResponseEntity<Map<String, Object>> getNotificationCount() {
        long count = enquiryService.getPendingCount();
        return ResponseEntity.ok(Map.of("success", true, "pendingCount", count));
    }

    // Helper: resolve admin ID from JWT principal username
    private Long getAdminId(Authentication auth) {
        if (auth == null) return null;
        return adminRepository.findByUsername(auth.getName())
                .map(a -> a.getAdminId())
                .orElse(null);
    }
}
