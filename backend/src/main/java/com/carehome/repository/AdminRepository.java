package com.carehome.repository;

import com.carehome.model.Admin;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;

/**
 * Admin repository using Spring JDBC Template.
 * All queries use parameterised PreparedStatements —
 * SQL injection is structurally impossible.
 */
@Repository
public class AdminRepository {

    private final JdbcTemplate jdbcTemplate;

    public AdminRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Find admin by username using a parameterised query.
     * The username is always bound as a parameter, never concatenated.
     */
    public Optional<Admin> findByUsername(String username) {
        String sql = "SELECT ADMIN_ID, USERNAME, PASSWORD_HASH, EMAIL, FULL_NAME, PHONE, CREATED_AT, IS_ACTIVE " +
                     "FROM ADMINS WHERE USERNAME = ? AND IS_ACTIVE = TRUE";

        return jdbcTemplate.query(sql, new AdminRowMapper(), username)
                .stream()
                .findFirst();
    }

    /**
     * Create a new admin with a hashed password.
     */
    public void createAdmin(String username, String passwordHash, String email, String fullName, String phone) {
        String sql = "INSERT INTO ADMINS (USERNAME, PASSWORD_HASH, EMAIL, FULL_NAME, PHONE) VALUES (?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql, username, passwordHash, email, fullName, phone);
    }

    /** DEV ONLY — update password hash by username. */
    public void updatePasswordHash(String username, String newHash) {
        String sql = "UPDATE ADMINS SET PASSWORD_HASH = ? WHERE USERNAME = ?";
        jdbcTemplate.update(sql, newHash, username);
    }

    // RowMapper
    private static class AdminRowMapper implements RowMapper<Admin> {
        @Override
        public Admin mapRow(ResultSet rs, int rowNum) throws SQLException {
            Admin admin = new Admin();
            admin.setAdminId(rs.getLong("ADMIN_ID"));
            admin.setUsername(rs.getString("USERNAME"));
            admin.setPasswordHash(rs.getString("PASSWORD_HASH"));
            admin.setEmail(rs.getString("EMAIL"));
            admin.setFullName(rs.getString("FULL_NAME"));
            admin.setPhone(rs.getString("PHONE"));
            admin.setCreatedAt(rs.getTimestamp("CREATED_AT").toLocalDateTime());
            admin.setActive(rs.getBoolean("IS_ACTIVE"));
            return admin;
        }
    }
}
