# 🏠 CareHome Services — Full-Stack Web Application

A professional care home services website built with **React.js** (frontend), **Spring Boot + JDBC** (backend), and **Oracle PL/SQL / H2** (database).

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+ (for frontend)
- **Java 17+** and **Maven 3.9+** (for backend)

### 1. Start the Backend

```bash
cd backend
mvn spring-boot:run
```

The backend will start on **http://localhost:8080**

- H2 Database Console: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:carehomedb;DB_CLOSE_DELAY=-1;MODE=Oracle`
  - Username: `sa` | Password: *(leave blank)*

### 2. Start the Frontend

```bash
cd frontend
npm install   # first time only
npm run dev
```

The frontend will start on **http://localhost:5173**

---

## 🔐 Default Admin Credentials

| Field    | Value         |
|----------|---------------|
| Username | `admin`       |
| Password | `Admin@123`   |
| Email    | `adarshmalayath2000@gmail.com` |
| Phone    | `07721445027` |

---

## 📧 Email Notifications Setup (Gmail)

When an admin replies to an enquiry, the customer automatically receives a **branded HTML email**.
To enable real email sending, generate a **Gmail App Password**:

1. Go to [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Sign in with `adarshmalayath2000@gmail.com`
3. Create an App Password (select **Mail** → **Other** → name it `CareHome`)
4. Copy the **16-character password** and start the backend with:

```bash
cd backend
MAIL_PASSWORD="your16charpassword" mvn spring-boot:run
```

> **Without `MAIL_PASSWORD`**: The reply is still saved to the database and a warning is logged,
> but no email is sent. Set `MAIL_ENABLED=false` to silence the warning entirely.

| Email Trigger | Sent To | Subject |
|---------------|---------|---------|
| Customer submits enquiry | Customer | `Enquiry Received — CareHome Services` |
| Admin replies to enquiry | Customer | `Re: Your {Service} Enquiry — CareHome Services` |


## 🗺️ Pages

| URL | Description |
|-----|-------------|
| `/` | Home page with hero, stats, services preview |
| `/services` | All 4 services with enquiry buttons |
| `/admin/login` | Secure admin login |
| `/admin` | Admin dashboard (protected) |
| `/admin/insights` | Insights charts (protected) |

---

## 🛡️ Security Features

- **BCrypt (rounds=12)** — Admin passwords are never stored in plaintext
- **Parameterised JDBC** — All DB queries use `PreparedStatement`; SQL injection is impossible
- **JWT (HS256, 8h expiry)** — Stateless admin authentication
- **Input validation** — Server-side with Jakarta Bean Validation + client-side
- **CORS** — Restricted to `localhost:5173` only
- **Timing-safe auth** — BCrypt comparison even on unknown usernames

---

## 🗄️ Oracle PL/SQL (Production)

For production use with Oracle Database:
1. Run `backend/src/main/resources/oracle_plsql.sql` on your Oracle instance
2. Update `application.properties`:
   ```properties
   spring.datasource.url=jdbc:oracle:thin:@localhost:1521:XE
   spring.datasource.username=carehome_user
   spring.datasource.password=your_password
   spring.sql.init.mode=never
   ```

---

## 📡 API Reference

### Public Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| `GET`  | `/api/services` | List available services |
| `POST` | `/api/enquiries` | Submit an enquiry |
| `POST` | `/api/admin/login` | Admin login → JWT |

### Admin Endpoints (JWT required)

| Method | URL | Description |
|--------|-----|-------------|
| `GET`  | `/api/admin/enquiries` | List enquiries (filter: `?status=PENDING`) |
| `PUT`  | `/api/admin/enquiries/{id}/reply` | Reply to enquiry |
| `PUT`  | `/api/admin/enquiries/{id}/discard` | Discard enquiry |
| `GET`  | `/api/admin/insights` | Dashboard statistics |
| `GET`  | `/api/admin/notifications/count` | Pending count |

---

## 🏗️ Project Structure

```
Care Project/
├── backend/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/carehome/
│       │   ├── CareHomeApplication.java
│       │   ├── config/SecurityConfig.java
│       │   ├── controller/  (EnquiryController, AdminController, GlobalExceptionHandler)
│       │   ├── service/     (AdminService, EnquiryService)
│       │   ├── repository/  (AdminRepository, EnquiryRepository)
│       │   ├── model/       (Admin, Enquiry, EnquiryStats)
│       │   ├── dto/         (LoginRequest, LoginResponse, EnquiryRequest, ReplyRequest)
│       │   └── security/    (JwtUtil, JwtAuthFilter)
│       └── resources/
│           ├── application.properties
│           ├── schema.sql          ← H2 schema (dev)
│           ├── data.sql            ← Seed data
│           └── oracle_plsql.sql    ← Oracle stored procedures (prod)
└── frontend/
    └── src/
        ├── pages/      (Home, Services, AdminLogin, AdminDashboard, AdminInsights)
        ├── components/ (Navbar, Footer, EnquiryModal, ReplyModal, ProtectedRoute)
        ├── context/    (AuthContext)
        └── api/        (axios.js, services.js)
```
