package com.carehome.controller;

import com.carehome.dto.EnquiryRequest;
import com.carehome.service.EnquiryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Public-facing enquiry controller.
 * POST /api/enquiries  — anyone can submit an enquiry.
 * GET  /api/services   — returns available services list.
 */
@RestController
@RequestMapping("/api")
public class EnquiryController {

    private final EnquiryService enquiryService;

    public EnquiryController(EnquiryService enquiryService) {
        this.enquiryService = enquiryService;
    }

    /**
     * Submit a new enquiry (public — no auth required).
     */
    @PostMapping("/enquiries")
    public ResponseEntity<Map<String, Object>> submitEnquiry(
            @Valid @RequestBody EnquiryRequest request) {
        Long enquiryId = enquiryService.submitEnquiry(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "success", true,
                "message", "Your enquiry has been submitted successfully. We will be in touch shortly.",
                "enquiryId", enquiryId
        ));
    }

    /**
     * Get available services list (public).
     */
    @GetMapping("/services")
    public ResponseEntity<Map<String, Object>> getServices() {
        List<Map<String, String>> services = List.of(
            Map.of("id", "driver",      "name", "Care Home Driver",
                   "description", "Professional and compassionate drivers for medical appointments and daily outings.",
                   "icon", "🚗"),
            Map.of("id", "cook",        "name", "Cook",
                   "description", "Skilled cooks providing nutritious, home-cooked meals tailored to dietary needs.",
                   "icon", "🍳"),
            Map.of("id", "care-worker", "name", "Care Worker",
                   "description", "Dedicated care workers offering personal care, companionship, and daily support.",
                   "icon", "❤️"),
            Map.of("id", "other",       "name", "Other Services",
                   "description", "From housekeeping to social activities — we are here to help with all your needs.",
                   "icon", "✨")
        );
        return ResponseEntity.ok(Map.of("services", services));
    }
}
