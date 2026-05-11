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

-- Sample Enquiries for Dashboard Demo
INSERT INTO ENQUIRIES (CUSTOMER_NAME, EMAIL, PHONE, ADDRESS, SERVICE_NAME, MESSAGE, STATUS)
VALUES ('Margaret Thompson', 'margaret.t@email.co.uk', '+44 7911 234567',
        '14 Elm Street, Manchester, M1 2AB', 'Care Worker',
        'Looking for a part-time care worker for my elderly mother who needs daily assistance.', 'PENDING');

INSERT INTO ENQUIRIES (CUSTOMER_NAME, EMAIL, PHONE, ADDRESS, SERVICE_NAME, MESSAGE, STATUS)
VALUES ('Robert Lawson', 'robert.lawson@email.co.uk', '+44 7802 345678',
        '7 Oak Avenue, Birmingham, B3 1CD', 'Care Home Driver',
        'Need a driver to take my father to hospital appointments twice a week.', 'PENDING');

INSERT INTO ENQUIRIES (CUSTOMER_NAME, EMAIL, PHONE, ADDRESS, SERVICE_NAME, MESSAGE, STATUS)
VALUES ('Susan Clarke', 'susan.clarke@gmail.com', '+44 7723 456789',
        '22 Pine Road, Leeds, LS2 3EF', 'Cook',
        'My grandmother requires a cook for lunch and dinner daily. She has a gluten intolerance.', 'REPLIED');

INSERT INTO ENQUIRIES (CUSTOMER_NAME, EMAIL, PHONE, ADDRESS, SERVICE_NAME, MESSAGE, STATUS)
VALUES ('David Patel', 'dpatel@outlook.com', '+44 7634 567890',
        '8 Birch Lane, London, SW1A 1AA', 'Other Services',
        'Interested in companionship and social activity services for my uncle.', 'DISCARDED');

INSERT INTO ENQUIRIES (CUSTOMER_NAME, EMAIL, PHONE, ADDRESS, SERVICE_NAME, MESSAGE, STATUS)
VALUES ('Helen Foster', 'helen.foster@email.co.uk', '+44 7545 678901',
        '31 Willow Close, Bristol, BS1 4GH', 'Care Worker',
        'Full-time care worker needed for post-surgery recovery support.', 'PENDING');
