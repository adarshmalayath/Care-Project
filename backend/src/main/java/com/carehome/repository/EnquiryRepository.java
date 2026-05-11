package com.carehome.repository;

import com.carehome.model.Enquiry;
import com.carehome.model.EnquiryStats;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Enquiry repository — all SQL uses parameterised PreparedStatements.
 * Never concatenates user input into SQL strings.
 */
@Repository
public class EnquiryRepository {

    private final JdbcTemplate jdbcTemplate;

    public EnquiryRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Insert a new enquiry. Returns the generated ID.
     */
    public Long createEnquiry(String customerName, String email, String phone,
                               String address, String serviceName, String message) {
        String sql = "INSERT INTO ENQUIRIES (CUSTOMER_NAME, EMAIL, PHONE, ADDRESS, SERVICE_NAME, MESSAGE, STATUS) " +
                     "VALUES (?, ?, ?, ?, ?, ?, 'PENDING')";

        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(conn -> {
            PreparedStatement ps = conn.prepareStatement(sql, new String[]{"ENQUIRY_ID"});
            ps.setString(1, customerName);
            ps.setString(2, email);
            ps.setString(3, phone);
            ps.setString(4, address);
            ps.setString(5, serviceName);
            ps.setString(6, message);
            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        return key != null ? key.longValue() : -1L;
    }

    /**
     * Retrieve all enquiries ordered by newest first.
     */
    public List<Enquiry> findAll() {
        String sql = "SELECT * FROM ENQUIRIES ORDER BY CREATED_AT DESC";
        return jdbcTemplate.query(sql, new EnquiryRowMapper());
    }

    /**
     * Find enquiries by status.
     */
    public List<Enquiry> findByStatus(String status) {
        String sql = "SELECT * FROM ENQUIRIES WHERE STATUS = ? ORDER BY CREATED_AT DESC";
        return jdbcTemplate.query(sql, new EnquiryRowMapper(), status);
    }

    /**
     * Find enquiry by ID.
     */
    public Optional<Enquiry> findById(Long enquiryId) {
        String sql = "SELECT * FROM ENQUIRIES WHERE ENQUIRY_ID = ?";
        return jdbcTemplate.query(sql, new EnquiryRowMapper(), enquiryId)
                .stream().findFirst();
    }

    /**
     * Update enquiry status to REPLIED with admin reply.
     */
    public int replyToEnquiry(Long enquiryId, String replyText, Long adminId) {
        String sql = "UPDATE ENQUIRIES SET STATUS = 'REPLIED', ADMIN_REPLY = ?, " +
                     "REPLIED_BY = ?, UPDATED_AT = ? WHERE ENQUIRY_ID = ?";
        return jdbcTemplate.update(sql, replyText, adminId, Timestamp.valueOf(LocalDateTime.now()), enquiryId);
    }

    /**
     * Update enquiry status to DISCARDED.
     */
    public int discardEnquiry(Long enquiryId, Long adminId) {
        String sql = "UPDATE ENQUIRIES SET STATUS = 'DISCARDED', " +
                     "REPLIED_BY = ?, UPDATED_AT = ? WHERE ENQUIRY_ID = ?";
        return jdbcTemplate.update(sql, adminId, Timestamp.valueOf(LocalDateTime.now()), enquiryId);
    }

    /**
     * Count pending enquiries (for notification badge).
     */
    public long countPending() {
        String sql = "SELECT COUNT(*) FROM ENQUIRIES WHERE STATUS = 'PENDING'";
        Long count = jdbcTemplate.queryForObject(sql, Long.class);
        return count != null ? count : 0L;
    }

    /**
     * Aggregate stats for insights dashboard.
     */
    public EnquiryStats getStats() {
        String sql =
            "SELECT " +
            "  COUNT(*) AS TOTAL_ENQUIRIES, " +
            "  SUM(CASE WHEN STATUS = 'PENDING'   THEN 1 ELSE 0 END) AS PENDING_COUNT, " +
            "  SUM(CASE WHEN STATUS = 'REPLIED'   THEN 1 ELSE 0 END) AS REPLIED_COUNT, " +
            "  SUM(CASE WHEN STATUS = 'DISCARDED' THEN 1 ELSE 0 END) AS DISCARDED_COUNT, " +
            "  SUM(CASE WHEN SERVICE_NAME = 'Care Home Driver' THEN 1 ELSE 0 END) AS DRIVER_COUNT, " +
            "  SUM(CASE WHEN SERVICE_NAME = 'Cook'            THEN 1 ELSE 0 END) AS COOK_COUNT, " +
            "  SUM(CASE WHEN SERVICE_NAME = 'Care Worker'     THEN 1 ELSE 0 END) AS CARE_WORKER_COUNT, " +
            "  SUM(CASE WHEN SERVICE_NAME = 'Other Services'  THEN 1 ELSE 0 END) AS OTHER_COUNT " +
            "FROM ENQUIRIES";

        return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
            EnquiryStats stats = new EnquiryStats();
            stats.setTotalEnquiries(rs.getLong("TOTAL_ENQUIRIES"));
            stats.setPendingCount(rs.getLong("PENDING_COUNT"));
            stats.setRepliedCount(rs.getLong("REPLIED_COUNT"));
            stats.setDiscardedCount(rs.getLong("DISCARDED_COUNT"));
            stats.setDriverCount(rs.getLong("DRIVER_COUNT"));
            stats.setCookCount(rs.getLong("COOK_COUNT"));
            stats.setCareWorkerCount(rs.getLong("CARE_WORKER_COUNT"));
            stats.setOtherCount(rs.getLong("OTHER_COUNT"));
            return stats;
        });
    }

    // RowMapper for Enquiry
    private static class EnquiryRowMapper implements RowMapper<Enquiry> {
        @Override
        public Enquiry mapRow(ResultSet rs, int rowNum) throws SQLException {
            Enquiry e = new Enquiry();
            e.setEnquiryId(rs.getLong("ENQUIRY_ID"));
            e.setCustomerName(rs.getString("CUSTOMER_NAME"));
            e.setEmail(rs.getString("EMAIL"));
            e.setPhone(rs.getString("PHONE"));
            e.setAddress(rs.getString("ADDRESS"));
            e.setServiceName(rs.getString("SERVICE_NAME"));
            e.setMessage(rs.getString("MESSAGE"));
            e.setStatus(rs.getString("STATUS"));
            e.setAdminReply(rs.getString("ADMIN_REPLY"));
            long repliedBy = rs.getLong("REPLIED_BY");
            e.setRepliedBy(rs.wasNull() ? null : repliedBy);
            Timestamp createdAt = rs.getTimestamp("CREATED_AT");
            e.setCreatedAt(createdAt != null ? createdAt.toLocalDateTime() : null);
            Timestamp updatedAt = rs.getTimestamp("UPDATED_AT");
            e.setUpdatedAt(updatedAt != null ? updatedAt.toLocalDateTime() : null);
            return e;
        }
    }
}
