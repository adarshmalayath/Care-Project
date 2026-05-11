-- ============================================
-- ORACLE PL/SQL Stored Procedures
-- Care Home Service Website
-- Use this script on Oracle XE / Oracle DB
-- ============================================

-- ============================================
-- SEQUENCES
-- ============================================
CREATE SEQUENCE SEQ_ADMIN_ID   START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE SEQ_ENQUIRY_ID START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

-- ============================================
-- TABLES
-- ============================================
CREATE TABLE ADMINS (
    ADMIN_ID      NUMBER        DEFAULT SEQ_ADMIN_ID.NEXTVAL NOT NULL,
    USERNAME      VARCHAR2(100) NOT NULL,
    PASSWORD_HASH VARCHAR2(255) NOT NULL,
    EMAIL         VARCHAR2(150),
    FULL_NAME     VARCHAR2(200),
    PHONE         VARCHAR2(25),
    CREATED_AT    TIMESTAMP     DEFAULT SYSTIMESTAMP,
    IS_ACTIVE     NUMBER(1)     DEFAULT 1,
    CONSTRAINT PK_ADMINS PRIMARY KEY (ADMIN_ID),
    CONSTRAINT UQ_ADMINS_USERNAME UNIQUE (USERNAME)
);

CREATE TABLE ENQUIRIES (
    ENQUIRY_ID    NUMBER         DEFAULT SEQ_ENQUIRY_ID.NEXTVAL NOT NULL,
    CUSTOMER_NAME VARCHAR2(150)  NOT NULL,
    EMAIL         VARCHAR2(150)  NOT NULL,
    PHONE         VARCHAR2(25)   NOT NULL,
    ADDRESS       VARCHAR2(500)  NOT NULL,
    SERVICE_NAME  VARCHAR2(100)  NOT NULL,
    MESSAGE       CLOB,
    STATUS        VARCHAR2(20)   DEFAULT 'PENDING' NOT NULL,
    ADMIN_REPLY   CLOB,
    REPLIED_BY    NUMBER,
    CREATED_AT    TIMESTAMP      DEFAULT SYSTIMESTAMP,
    UPDATED_AT    TIMESTAMP      DEFAULT SYSTIMESTAMP,
    CONSTRAINT PK_ENQUIRIES PRIMARY KEY (ENQUIRY_ID),
    CONSTRAINT FK_ENQUIRIES_ADMIN FOREIGN KEY (REPLIED_BY) REFERENCES ADMINS(ADMIN_ID),
    CONSTRAINT CHK_STATUS CHECK (STATUS IN ('PENDING', 'REPLIED', 'DISCARDED'))
);

-- ============================================
-- PROCEDURE: sp_create_enquiry
-- Creates a new enquiry (prevents SQL injection
-- via bind variables)
-- ============================================
CREATE OR REPLACE PROCEDURE sp_create_enquiry (
    p_customer_name IN VARCHAR2,
    p_email         IN VARCHAR2,
    p_phone         IN VARCHAR2,
    p_address       IN VARCHAR2,
    p_service_name  IN VARCHAR2,
    p_message       IN CLOB,
    p_enquiry_id    OUT NUMBER
)
AS
BEGIN
    INSERT INTO ENQUIRIES (
        CUSTOMER_NAME, EMAIL, PHONE, ADDRESS,
        SERVICE_NAME, MESSAGE, STATUS, CREATED_AT, UPDATED_AT
    ) VALUES (
        p_customer_name, p_email, p_phone, p_address,
        p_service_name, p_message, 'PENDING', SYSTIMESTAMP, SYSTIMESTAMP
    ) RETURNING ENQUIRY_ID INTO p_enquiry_id;

    COMMIT;

EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END sp_create_enquiry;
/

-- ============================================
-- PROCEDURE: sp_update_enquiry_status
-- Updates enquiry status — REPLIED or DISCARDED
-- ============================================
CREATE OR REPLACE PROCEDURE sp_update_enquiry_status (
    p_enquiry_id IN NUMBER,
    p_status     IN VARCHAR2,
    p_reply      IN CLOB,
    p_admin_id   IN NUMBER
)
AS
    v_count NUMBER;
BEGIN
    -- Verify enquiry exists
    SELECT COUNT(*) INTO v_count FROM ENQUIRIES WHERE ENQUIRY_ID = p_enquiry_id;
    IF v_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20001, 'Enquiry not found: ' || p_enquiry_id);
    END IF;

    -- Validate status
    IF p_status NOT IN ('REPLIED', 'DISCARDED') THEN
        RAISE_APPLICATION_ERROR(-20002, 'Invalid status value: ' || p_status);
    END IF;

    UPDATE ENQUIRIES
    SET    STATUS      = p_status,
           ADMIN_REPLY = p_reply,
           REPLIED_BY  = p_admin_id,
           UPDATED_AT  = SYSTIMESTAMP
    WHERE  ENQUIRY_ID = p_enquiry_id;

    COMMIT;

EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END sp_update_enquiry_status;
/

-- ============================================
-- PROCEDURE: sp_get_insights
-- Returns enquiry statistics for dashboard
-- ============================================
CREATE OR REPLACE PROCEDURE sp_get_insights (
    p_cursor OUT SYS_REFCURSOR
)
AS
BEGIN
    OPEN p_cursor FOR
        SELECT
            (SELECT COUNT(*) FROM ENQUIRIES)                         AS TOTAL_ENQUIRIES,
            (SELECT COUNT(*) FROM ENQUIRIES WHERE STATUS = 'PENDING')   AS PENDING_COUNT,
            (SELECT COUNT(*) FROM ENQUIRIES WHERE STATUS = 'REPLIED')   AS REPLIED_COUNT,
            (SELECT COUNT(*) FROM ENQUIRIES WHERE STATUS = 'DISCARDED') AS DISCARDED_COUNT,
            (SELECT COUNT(*) FROM ENQUIRIES WHERE SERVICE_NAME = 'Care Home Driver')  AS DRIVER_COUNT,
            (SELECT COUNT(*) FROM ENQUIRIES WHERE SERVICE_NAME = 'Cook')              AS COOK_COUNT,
            (SELECT COUNT(*) FROM ENQUIRIES WHERE SERVICE_NAME = 'Care Worker')       AS CARE_WORKER_COUNT,
            (SELECT COUNT(*) FROM ENQUIRIES WHERE SERVICE_NAME = 'Other Services')    AS OTHER_COUNT
        FROM DUAL;
END sp_get_insights;
/

-- ============================================
-- PROCEDURE: sp_authenticate_admin
-- Returns admin password hash for username
-- (bind variable prevents SQL injection)
-- ============================================
CREATE OR REPLACE PROCEDURE sp_authenticate_admin (
    p_username      IN  VARCHAR2,
    p_password_hash OUT VARCHAR2,
    p_admin_id      OUT NUMBER,
    p_full_name     OUT VARCHAR2,
    p_email         OUT VARCHAR2
)
AS
BEGIN
    SELECT PASSWORD_HASH, ADMIN_ID, FULL_NAME, EMAIL
    INTO   p_password_hash, p_admin_id, p_full_name, p_email
    FROM   ADMINS
    WHERE  USERNAME = p_username
    AND    IS_ACTIVE = 1;

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        p_password_hash := NULL;
        p_admin_id      := NULL;
        p_full_name     := NULL;
        p_email         := NULL;
END sp_authenticate_admin;
/

-- ============================================
-- PROCEDURE: sp_create_admin
-- Creates a new admin with hashed password
-- ============================================
CREATE OR REPLACE PROCEDURE sp_create_admin (
    p_username      IN VARCHAR2,
    p_password_hash IN VARCHAR2,
    p_email         IN VARCHAR2,
    p_full_name     IN VARCHAR2,
    p_phone         IN VARCHAR2,
    p_admin_id      OUT NUMBER
)
AS
BEGIN
    INSERT INTO ADMINS (USERNAME, PASSWORD_HASH, EMAIL, FULL_NAME, PHONE)
    VALUES (p_username, p_password_hash, p_email, p_full_name, p_phone)
    RETURNING ADMIN_ID INTO p_admin_id;

    COMMIT;

EXCEPTION
    WHEN DUP_VAL_ON_INDEX THEN
        RAISE_APPLICATION_ERROR(-20003, 'Admin username already exists: ' || p_username);
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END sp_create_admin;
/

-- ============================================
-- Default Admin Insert (password: Admin@123)
-- Hash generated by BCrypt rounds=12 (verified)
-- ============================================
INSERT INTO ADMINS (USERNAME, PASSWORD_HASH, EMAIL, FULL_NAME, PHONE)
VALUES ('admin', '$2a$12$/WLkGDZPdhGj.VUBF0i.x.St.btwqGoqGJmkxpWpTQ4d63lX6RmTe',
        'adarshmalayath2000@gmail.com', 'Care Home Administrator', '07721445027');
COMMIT;
