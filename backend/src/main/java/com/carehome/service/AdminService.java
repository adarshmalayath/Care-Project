package com.carehome.service;

import com.carehome.dto.LoginRequest;
import com.carehome.dto.LoginResponse;
import com.carehome.model.Admin;
import com.carehome.repository.AdminRepository;
import com.carehome.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Admin service — handles authentication with BCrypt password comparison.
 * Timing-safe password comparison prevents timing attacks.
 */
@Service
public class AdminService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AdminService(AdminRepository adminRepository,
                        PasswordEncoder passwordEncoder,
                        JwtUtil jwtUtil) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Authenticates admin credentials.
     * BCrypt.matches() is timing-safe.
     * Returns null if credentials are invalid (no exception leaking).
     */
    public LoginResponse authenticate(LoginRequest request) {
        Optional<Admin> adminOpt = adminRepository.findByUsername(request.getUsername());

        if (adminOpt.isEmpty()) {
            // Still run BCrypt to prevent timing attacks (username enumeration)
            passwordEncoder.matches(request.getPassword(), "$2a$12$dummy.hash.to.prevent.timing.attack.padding");
            return null;
        }

        Admin admin = adminOpt.get();

        // BCrypt comparison — timing-safe
        if (!passwordEncoder.matches(request.getPassword(), admin.getPasswordHash())) {
            return null;
        }

        String token = jwtUtil.generateToken(admin.getUsername(), admin.getAdminId());

        return new LoginResponse(
                token,
                admin.getUsername(),
                admin.getFullName(),
                admin.getEmail(),
                admin.getPhone(),
                jwtUtil.getExpirationMs()
        );
    }

    /**
     * Utility to hash a raw password (used for admin creation / testing).
     */
    public String hashPassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }
}
