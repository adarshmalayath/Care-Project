-- ============================================
-- Seed Data — Care Home Database
-- ============================================

-- Default Admin Account
-- Username: admin | Password: Admin@123  (BCrypt hashed, rounds=12)
INSERT INTO ADMINS (USERNAME, PASSWORD_HASH, EMAIL, FULL_NAME, PHONE)
VALUES (
    'admin',
    '$2a$12$/WLkGDZPdhGj.VUBF0i.x.St.btwqGoqGJmkxpWpTQ4d63lX6RmTe',
    'adarshmalayath@gmail.com',
    'Bruce Wayne',
    '07721445027'
);

