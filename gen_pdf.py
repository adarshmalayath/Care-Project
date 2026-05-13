#!/usr/bin/env python3
from fpdf import FPDF
from fpdf.enums import XPos, YPos
from PIL import Image
import os, glob

BASE = "/Users/adarsh/Care Project"
ARTS = "/Users/adarsh/.gemini/antigravity/brain/872ebb6c-3326-4015-8479-c0fa7ddad66e"
OUT  = f"{BASE}/CareHome_Documentation.pdf"

SS = {}
for name in ["home","services_section","services_page","login","dashboard","notifications","enquiry_expanded","insights"]:
    matches = sorted(glob.glob(f"{ARTS}/ss_{name}*.png"), reverse=True)
    if matches:
        SS[name] = matches[0]

NAVY  = (8,17,30)
BLUE  = (59,130,246)
WHITE = (226,234,244)
GREY  = (100,130,160)
DARK  = (13,27,46)

def clean(s):
    return s.encode('latin-1','replace').decode('latin-1')

class PDF(FPDF):
    def header(self):
        # Fill navy background on EVERY page (fixes blank auto-break pages)
        self.set_fill_color(*NAVY)
        self.rect(0, 0, 297, 210, 'F')
        if self.page_no() == 1:
            return
        # Top bar
        self.set_fill_color(13, 27, 46)
        self.rect(0, 0, 297, 12, 'F')
        self.set_font("Helvetica", "B", 9)
        self.set_text_color(*BLUE)
        self.set_xy(10, 2)
        self.cell(0, 8, "CareHome Services - Technical Documentation")

    def footer(self):
        self.set_y(-12)
        self.set_font("Helvetica", "", 8)
        self.set_text_color(*GREY)
        self.cell(0, 10, f"Page {self.page_no()}", align="C")

pdf = PDF(orientation="L", unit="mm", format="A4")
pdf.set_auto_page_break(True, margin=18)
pdf.set_margins(12, 16, 12)

def ch(num, title):
    pdf.ln(3)
    pdf.set_fill_color(*BLUE)
    pdf.rect(12, pdf.get_y(), 273, 8, 'F')
    pdf.set_font("Helvetica", "B", 12)
    pdf.set_text_color(255, 255, 255)
    pdf.set_xy(15, pdf.get_y() + 1)
    pdf.cell(0, 6, f"{num}. {title}", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(2)

def sec(t):
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(*BLUE)
    pdf.cell(0, 6, t, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(1)

def body(t):
    pdf.set_font("Helvetica", "", 9)
    pdf.set_text_color(*WHITE)
    pdf.multi_cell(0, 5, clean(t.strip()))
    pdf.ln(2)

def code(t, maxl=25):
    lines = t.strip().splitlines()[:maxl]
    h = len(lines) * 3.8 + 4
    # If code block won't fit, start a new page — header() handles background
    if pdf.get_y() + h > 192:
        pdf.add_page()
    pdf.set_fill_color(*DARK)
    pdf.set_draw_color(30, 58, 95)
    pdf.rect(12, pdf.get_y(), 273, h, 'FD')
    pdf.set_font("Courier", "", 7.5)
    pdf.set_text_color(180, 210, 244)
    pdf.set_xy(15, pdf.get_y() + 2)
    for l in lines:
        pdf.cell(267, 3.8, clean(l[:120]), new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(3)

def ss(key, caption="", max_h=120):
    path = SS.get(key)
    if not path or not os.path.exists(path):
        body(f"[Screenshot: {key} - not found]")
        return
    try:
        img = Image.open(path)
        iw, ih = img.size
        ratio = ih / iw
        w = 273
        h = w * ratio
        if h > max_h:
            h = max_h
            w = h / ratio
        x = (297 - w) / 2
        # If image won't fit remaining space, add page — header() fills background
        if pdf.get_y() + h + 10 > 192:
            pdf.add_page()
        pdf.image(path, x=x, y=pdf.get_y(), w=w, h=h)
        pdf.set_y(pdf.get_y() + h + 2)
        if caption:
            pdf.set_font("Helvetica", "I", 8)
            pdf.set_text_color(*GREY)
            pdf.cell(0, 5, caption, align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.ln(3)
    except Exception as e:
        body(f"[Image error: {e}]")

# ── COVER ──────────────────────────────────────────────────────────────────
pdf.add_page()
pdf.set_y(60)
pdf.set_font("Helvetica","B",36); pdf.set_text_color(*BLUE)
pdf.cell(0,14,"CareHome Services",align="C",new_x=XPos.LMARGIN,new_y=YPos.NEXT)
pdf.set_font("Helvetica","",18); pdf.set_text_color(*WHITE)
pdf.cell(0,10,"Technical Documentation",align="C",new_x=XPos.LMARGIN,new_y=YPos.NEXT)
pdf.ln(6)
pdf.set_draw_color(*BLUE); pdf.set_line_width(0.8)
pdf.line(60,pdf.get_y(),237,pdf.get_y()); pdf.ln(10)
pdf.set_font("Helvetica","",11); pdf.set_text_color(*GREY)
for l in ["Full-Stack Web Application",
          "React 18  *  Spring Boot 3  *  H2 / Oracle DB",
          "Deployed on GitHub Pages + Cloudflare Tunnel","",
          "https://adarshmalayath.github.io/Care-Project/"]:
    pdf.cell(0,7,l,align="C",new_x=XPos.LMARGIN,new_y=YPos.NEXT)

# ── 1. OVERVIEW ────────────────────────────────────────────────────────────
pdf.add_page()
ch("1","Project Overview")
sec("What is CareHome Services?")
body("CareHome Services is a full-stack web application allowing families to submit care-home staffing enquiries (Care Workers, Drivers, Cooks, Other Services). Administrators manage all enquiries via a secure dashboard and send replies via email automatically.")
sec("Technology Stack")
for k,v in [("Frontend","React 18, Vite, React Router v6, Framer Motion, Axios"),
            ("Backend","Spring Boot 3, Spring Security (JWT), Spring Mail"),
            ("Database","H2 In-Memory (dev) / Oracle (prod)"),
            ("Styling","Vanilla CSS with dark navy design tokens"),
            ("CI/CD","GitHub Actions -> GitHub Pages (static hosting)"),
            ("API Tunnel","Cloudflare Tunnel (exposes local backend publicly)"),
            ("Email","Gmail SMTP via App Password, sent @Async")]:
    pdf.set_font("Helvetica","B",9); pdf.set_text_color(*BLUE); pdf.cell(38,5.5,f"  {k}:")
    pdf.set_font("Helvetica","",9); pdf.set_text_color(*WHITE); pdf.cell(0,5.5,v,new_x=XPos.LMARGIN,new_y=YPos.NEXT)
pdf.ln(4)
sec("System Architecture")
body("""  [User Browser]
       | HTTPS requests
       v
  [GitHub Pages - static HTML/CSS/JS]  <-- [GitHub Actions build on git push]
       | API calls via Cloudflare Tunnel
       v
  [Cloudflare Tunnel] --> [localhost:8080 Spring Boot]
                               |
                   [H2 In-Memory Database] + [Gmail SMTP email]""")

# ── 2. USER PAGES ──────────────────────────────────────────────────────────
pdf.add_page()
ch("2","User-Facing Pages")
sec("2.1 Homepage - Hero Section")
body("Full-bleed hero with care-worker illustration, dark gradient overlay, and prominent CTA button. The icon-only navbar (Home, Services, Admin Login icons with hover tooltips) stays compact on all screen sizes.")
ss("home","Fig 1: Homepage Hero Section", max_h=118)

pdf.add_page()
sec("2.2 Services Section (Homepage)")
body("Four service cards in a responsive grid: Care Worker, Care Home Driver, Cook, Other Services. Each card has an icon, description, and 'Enquire Now' button that opens the enquiry modal.")
ss("services_section","Fig 2: Services Cards on Homepage", max_h=118)

pdf.add_page()
sec("2.3 Services Page (/services)")
body("Dedicated services page with expanded descriptions and a full enquiry form modal. The form validates all fields, sends a confirmation email to the customer on submission.")
ss("services_page","Fig 3: Full Services Page", max_h=118)

# ── 3. ADMIN MODULE ────────────────────────────────────────────────────────
pdf.add_page()
ch("3","Admin Module")
sec("3.1 Admin Login (/admin/login)")
body("Secure login with username + password. On success, JWT is stored in AuthContext (memory only, not localStorage). Invalid credentials show an error toast. Protected routes redirect unauthenticated users back to this page.")
ss("login","Fig 4: Admin Login Page", max_h=118)

pdf.add_page()
sec("3.2 Admin Dashboard")
body("Four stat cards (Total, Pending, Replied, Discarded) always show real totals regardless of active filter. Enquiry cards are filterable by status, searchable by name/email, and expandable for full details and actions.")
ss("dashboard","Fig 5: Admin Dashboard", max_h=118)

pdf.add_page()
sec("3.3 Notification Bell Popup")
body("The bell icon shows a pending count badge. Clicking opens a slide-down overlay listing all PENDING enquiries with name, service, date. 'View' scrolls to that specific enquiry card without changing the active filter or stat totals.")
ss("notifications","Fig 6: Notification Popup", max_h=118)

pdf.add_page()
sec("3.4 Expanded Enquiry Card")
body("Clicking any enquiry expands it to reveal address, message, admin reply preview (if exists), and action buttons: Reply (opens reply modal, sends email to customer) and Discard (marks as DISCARDED).")
ss("enquiry_expanded","Fig 7: Expanded Enquiry Card", max_h=118)

# ── 4. BACKEND ─────────────────────────────────────────────────────────────
pdf.add_page()
ch("4","Backend Architecture")
sec("4.1 Package Structure")
body("""/backend/src/main/java/com/carehome/
  CareHomeApplication.java        - Entry point with startup banner
  config/
    SecurityConfig.java           - JWT + CORS + BCrypt (strength 12)
  controller/
    AdminController.java          - /api/admin/** endpoints
    EnquiryController.java        - /api/enquiries endpoint
    HealthController.java         - /api/health ping
  security/
    JwtAuthFilter.java            - Per-request token validation
    JwtUtil.java                  - Token generation and parsing
  service/
    AdminService.java             - Admin business logic
    EnquiryService.java           - Enquiry CRUD operations
    EmailService.java             - Async email via Gmail SMTP""")
sec("4.2 Security Configuration")
code("""\
@Configuration @EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(s -> s.sessionCreationPolicy(STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(POST, "/api/enquiries").permitAll()
                .requestMatchers(POST, "/api/admin/login").permitAll()
                .requestMatchers("/api/health").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}""", 25)
sec("4.3 JWT Authentication Flow")
body("""1. POST /api/admin/login validates credentials with BCrypt.matches()
2. JwtUtil.generateToken(username) creates a signed JWT (8hr expiry, HS256)
3. Response returns { token, username, fullName, email }
4. Frontend stores token in AuthContext (memory, cleared on logout/refresh)
5. All /api/admin/** requests include: Authorization: Bearer <token>
6. JwtAuthFilter validates token signature and expiry on every protected request""")
sec("4.4 Email Service")
code("""\
@Service
public class EmailService {
    @Async
    public void sendEnquiryConfirmation(Enquiry e) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(e.getEmail());
        msg.setSubject("Enquiry Received - CareHome Services");
        msg.setText("Dear " + e.getCustomerName() + ",\\nyour enquiry has been received...");
        mailSender.send(msg);
    }
    @Async
    public void sendAdminReply(Enquiry e, String replyText) {
        // sends personalised reply email to customer
    }
}""", 15)

# ── 5. API REFERENCE ───────────────────────────────────────────────────────
pdf.add_page()
ch("5","API Reference")
body("Base URL (live): https://<cloudflare-tunnel>/api        Local: http://localhost:8080/api")
pdf.ln(2)
cols=[22,90,22,139]
pdf.set_fill_color(*BLUE); pdf.set_font("Helvetica","B",8); pdf.set_text_color(255,255,255)
for t,w in zip(["Method","Endpoint","Auth","Description"],cols):
    pdf.cell(w,7,t,fill=True)
pdf.ln()
method_colors={"POST":(59,130,246),"GET":(16,185,129)}
for method,path,auth,desc in [
    ("POST","/enquiries","Public","Submit new customer enquiry (triggers confirmation email)"),
    ("GET", "/services","Public","List available service names"),
    ("GET", "/health","Public","Health check ping - returns {status:UP}"),
    ("POST","/admin/login","Public","Admin login - returns signed JWT token"),
    ("GET", "/admin/enquiries","JWT","List all enquiries, optional ?status= filter"),
    ("POST","/admin/enquiries/{id}/reply","JWT","Send reply to customer (emails them)"),
    ("POST","/admin/enquiries/{id}/discard","JWT","Mark enquiry as DISCARDED"),
    ("GET", "/admin/insights","JWT","Aggregated stats for insights charts"),
]:
    c=method_colors.get(method,(100,100,100))
    pdf.set_fill_color(*c); pdf.set_text_color(255,255,255)
    pdf.set_font("Helvetica","B",8); pdf.cell(22,6,method,fill=True)
    pdf.set_fill_color(*DARK); pdf.set_text_color(*WHITE)
    pdf.set_font("Courier","",8); pdf.cell(90,6,path,fill=True)
    clr=(245,158,11) if auth=="JWT" else (16,185,129)
    pdf.set_fill_color(*clr); pdf.set_text_color(255,255,255)
    pdf.set_font("Helvetica","B",7); pdf.cell(22,6,auth,fill=True,align="C")
    pdf.set_fill_color(*DARK); pdf.set_text_color(*WHITE)
    pdf.set_font("Helvetica","",8); pdf.cell(139,6,desc,fill=True)
    pdf.ln()
pdf.ln(4)
sec("Request Body - POST /api/enquiries")
code('{\n  "customerName": "John Smith",\n  "email": "john@example.com",\n  "phone": "+44 7700 900000",\n  "address": "12 Oak Street, London, SW1A 1AA",\n  "serviceName": "Care Worker",\n  "message": "Looking for a part-time care worker."\n}',8)
sec("Response - POST /api/admin/login")
code('{\n  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",\n  "username": "admin",\n  "fullName": "Bruce Wayne",\n  "email": "adarshmalayath@gmail.com"\n}',6)

# ── 6. DATABASE ────────────────────────────────────────────────────────────
pdf.add_page()
ch("6","Database Schema")
sec("6.1 ADMINS Table")
code("""\
CREATE TABLE ADMINS (
  ADMIN_ID      BIGINT       NOT NULL DEFAULT NEXT VALUE FOR SEQ_ADMIN_ID,
  USERNAME      VARCHAR(100) NOT NULL,
  PASSWORD_HASH VARCHAR(255) NOT NULL,   -- BCrypt strength 12 hash
  EMAIL         VARCHAR(150),
  FULL_NAME     VARCHAR(200),
  PHONE         VARCHAR(25),
  CREATED_AT    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  IS_ACTIVE     BOOLEAN      DEFAULT TRUE,
  CONSTRAINT PK_ADMINS PRIMARY KEY (ADMIN_ID),
  CONSTRAINT UQ_ADMINS_USERNAME UNIQUE (USERNAME)
)""", 13)
sec("6.2 ENQUIRIES Table")
code("""\
CREATE TABLE ENQUIRIES (
  ENQUIRY_ID    BIGINT       NOT NULL DEFAULT NEXT VALUE FOR SEQ_ENQUIRY_ID,
  CUSTOMER_NAME VARCHAR(150) NOT NULL,
  EMAIL         VARCHAR(150) NOT NULL,
  PHONE         VARCHAR(25)  NOT NULL,
  ADDRESS       VARCHAR(500) NOT NULL,
  SERVICE_NAME  VARCHAR(100) NOT NULL,
  MESSAGE       CLOB,
  STATUS        VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
  ADMIN_REPLY   CLOB,
  REPLIED_BY    BIGINT,                  -- FK -> ADMINS(ADMIN_ID)
  CREATED_AT    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  UPDATED_AT    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT PK_ENQUIRIES PRIMARY KEY (ENQUIRY_ID),
  CONSTRAINT FK_ENQUIRIES_ADMIN FOREIGN KEY (REPLIED_BY) REFERENCES ADMINS(ADMIN_ID),
  CONSTRAINT CHK_STATUS CHECK (STATUS IN ('PENDING','REPLIED','DISCARDED'))
)""", 18)
body("Indexes: IDX_ENQUIRIES_STATUS  |  IDX_ENQUIRIES_SERVICE  |  IDX_ENQUIRIES_CREATED")

# ── 7. FRONTEND ────────────────────────────────────────────────────────────
pdf.add_page()
ch("7","Frontend Architecture")
sec("7.1 Project Structure")
body("""/frontend/src/
  App.jsx                  - Routes + BrowserRouter (basename=/Care-Project/)
  index.css                - Global design tokens + responsive media queries
  api/
    axios.js               - Axios instance using VITE_API_URL base URL
    services.js            - Typed API call functions (login, getEnquiries, etc.)
  context/
    AuthContext.jsx        - JWT auth state, login() and logout() helpers
  components/
    Navbar.jsx             - Icon-only nav with hover tooltips
    Footer.jsx             - Site footer with links
    EnquiryModal.jsx       - Customer enquiry form with validation
    ReplyModal.jsx         - Admin reply modal editor
    ProtectedRoute.jsx     - Redirects unauthenticated to /admin/login
  pages/
    Home.jsx               - Hero section + services overview
    Services.jsx           - Full services listing page
    AdminLogin.jsx         - Admin login form
    AdminDashboard.jsx     - Enquiry management + notification popup
    AdminInsights.jsx      - Analytics charts page""")
sec("7.2 Key Design Decisions")
for item in [
    "Icon-only Navbar: compact on all screen sizes, no hamburger menu needed",
    "totalCount state: stat cards show real totals, unaffected by active filter",
    "SPA routing fix: 404.html redirect + index.html decode for GitHub Pages",
    "Framer Motion: smooth card expand/collapse and notification popup animations",
    "CSS custom properties: full dark navy design system with token variables",
    "@Async email: API responds immediately, email delivery happens in background",
]:
    pdf.set_font("Helvetica","",9); pdf.set_text_color(*WHITE)
    pdf.cell(5,6,"*"); pdf.cell(0,6,item,new_x=XPos.LMARGIN,new_y=YPos.NEXT)

# ── 8. DEPLOYMENT ──────────────────────────────────────────────────────────
pdf.add_page()
ch("8","Deployment")
sec("8.1 GitHub Actions CI/CD")
code("""\
# .github/workflows/deploy.yml (simplified)
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
        working-directory: frontend
      - run: npm run build
        working-directory: frontend
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
      - uses: peaceiris/actions-gh-pages@v3
        with: { publish_dir: ./frontend/dist }""", 16)
sec("8.2 SPA Routing Fix")
body("GitHub Pages returns 404 for any URL other than /. Fix: 404.html encodes the path as a query string and redirects to index.html. index.html decodes it back into browser history before React Router mounts - all routes work correctly.")
sec("8.3 Cloudflare Tunnel")
body("The backend runs locally on port 8080. Cloudflare Tunnel creates a temporary public HTTPS URL which is set as the API base URL in the frontend build. A new URL is generated each tunnel session and the frontend must be redeployed with the updated URL.")
sec("8.4 Live URLs")
for label,url in [("Homepage","https://adarshmalayath.github.io/Care-Project/"),
                  ("Services","https://adarshmalayath.github.io/Care-Project/services"),
                  ("Admin Login","https://adarshmalayath.github.io/Care-Project/admin/login"),
                  ("Admin Dashboard","https://adarshmalayath.github.io/Care-Project/admin")]:
    pdf.set_font("Helvetica","B",9); pdf.set_text_color(*BLUE); pdf.cell(35,6,f"  {label}:")
    pdf.set_font("Helvetica","",9); pdf.set_text_color(*WHITE); pdf.cell(0,6,url,new_x=XPos.LMARGIN,new_y=YPos.NEXT)


pdf.output(OUT)
print(f"PDF generated ({os.path.getsize(OUT)//1024} KB): {OUT}")
