# OANK Cleaning CIC - Full-Stack Web Portal & Social Enterprise System
> **Legal Form:** Standalone Community Interest Company (CIC)  
> **HQ Location:** Paisley PA3 2PJ, Renfrewshire, Scotland  
> **Official Website:** [oankcleaning.co.uk](https://oankcleaning.co.uk)

---

## 🏛️ Company Structure & Social Purpose

OANK Cleaning CIC is an independent Community Interest Company registered in Scotland, standing on its own and funded by its own commercial trading revenue.
- **Commercial Operations**: High-end domestic housekeeping, commercial & healthcare facility maintenance, and 100% deposit-guaranteed end of tenancy cleans across Paisley, Greater Glasgow, and Renfrewshire.
- **Social Mission**: Surpluses fund two key community initiatives:
  1. **OANK Home Reset**: Targeted hygiene restoration for individuals facing physical, psychological, or situational barriers.
  2. **Employment Pathway**: Paid training, COSHH certification, and supervised work experience for individuals facing labor-market hurdles.
- **Authoritative Governance**: See `GOVERNANCE.md` and `operation.md` for policy frameworks and operating principles.

---

## 🛰️ Frontend - Backend Architecture & Communication Overview

The OANK Cleaning platform uses a high-performance **decoupled React SPA (Single Page Application)** frontend paired with an **asynchronous RESTful PHP backend**.

```
┌─────────────────────────────────────────────────────────┐
│              Client Browser (React 18 SPA)              │
│  [QuoteCalculator] [ContactForm] [ChatWidget (AI/Rules)]│
└──────────────────────────┬──────────────────────────────┘
                           │ 
                           │ HTTP POST / GET (JSON payload)
                           ▼
┌─────────────────────────────────────────────────────────┐
│               Axios Client (`src/lib/api.ts`)            │
│       • baseURL: '/api' (or full backend URL)          │
│       • Content-Type: application/json                  │
│       • Automatic Fallback & Error Handling             │
└──────────────────────────┬──────────────────────────────┘
                           │ 
                           │ Proxy / CORS Routed Requests
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   PHP Backend (/backend/api)            │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────┐  │
│  │   cors.php   │  │   config.php  │  │ database.php │  │
│  └──────┬───────┘  └───────┬───────┘  └──────┬───────┘  │
│         │                  │                 │          │
│         ▼                  ▼                 ▼          │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────┐  │
│  │ contact.php  │  │   quote.php   │  │ sitemap.php  │  │
│  └──────┬───────┘  └───────┴───────┘  └──────────────┘  │
└─────────┼───────────────────────────────────────────────┘
          │
          ├────────────────────────┬────────────────────────┐
          ▼                        ▼                        ▼
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  MySQL Database  │     │ Notification Mail│     │ Client Auto-Resp.│
│ (`enquiries` tbl)│     │  to Admin Team   │     │ Confirmation Mail│
└──────────────────┘     └──────────────────┘     └──────────────────┘
```

### Communication Flow:
1. **User Interaction**: When a user submits a contact form (`ContactForm.tsx`), requests an instant quote (`QuoteCalculator.tsx`), or interacts with the floating chat widget (`ChatWidget.tsx`).
2. **API Client (`src/lib/api.ts`)**: 
   - Uses an Axios instance targeting `/api/contact` or `/api/quote`.
   - Sends a structured JSON payload (`ContactFormData` or `QuoteFormData`).
3. **CORS & Preflight Handling (`backend/api/cors.php`)**:
   - The backend validates the incoming HTTP `ORIGIN` header against allowed domains (`oankcleaning.co.uk`, local dev environments).
   - Handles HTTP `OPTIONS` preflight requests gracefully and returns JSON responses with proper headers.
4. **Backend Processing (`contact.php` / `quote.php`)**:
   - Parses `php://input` JSON request body.
   - Generates a unique tracking reference number (e.g., `OANK-842915`).
   - Inserts the submission into the MySQL database (`database.php` PDO wrapper).
   - Triggers native PHP `mail()` to send:
     1. **Admin Notification Email**: Detailed alert sent to `info@oankcleaning.co.uk` and backup `hormotholar@yahoo.com`.
     2. **Customer Confirmation Email**: HTML email sent to the user with preferred booking details, tracking reference, and direct WhatsApp contact link (`COMPANY_WHATSAPP_LINK`).
5. **Response & Feedback**: Returns a JSON object `{ success: true, message: "...", referenceNo: "OANK-..." }` to display interactive feedback on the UI without page reloading.

---

## 📋 Comprehensive To-Do Checklist: Configuration & Installation

### Phase 1: Environment & Prerequisites Setup
- [ ] **Node.js**: Verify Node.js `v18+` or `v20+` is installed on your local machine (`node -v`).
- [ ] **Web Server**: Ensure an Apache or Nginx web server with PHP `7.4+` or PHP `8.x` is installed.
- [ ] **MySQL Database**: Ensure MySQL `5.7+` or MariaDB is available.
- [ ] **PHP Extensions**: Enable the following PHP modules in `php.ini`:
  - `pdo_mysql`
  - `openssl`
  - `json`
  - `mbstring`

---

### Phase 2: Repository Installation & Frontend Build
- [ ] **Clone Repository**:
  ```bash
  git clone <repository-url>
  cd oank-cleaning
  ```
- [ ] **Install Frontend Dependencies**:
  ```bash
  npm install
  ```
- [ ] **Run Development Server**:
  ```bash
  npm run dev
  ```
  Access the app at `http://localhost:3000`.
- [ ] **Build Production Bundle**:
  ```bash
  npm run build
  ```
  This creates a production-ready `dist/` folder containing static assets.

---

### Phase 3: Backend Configuration (`backend/api/config.php`)
- [ ] **Set Database Credentials**:
  ```php
  define('DB_HOST', '127.0.0.1'); // or your MySQL host
  define('DB_PORT', '3306');
  define('DB_NAME', 'oankcleaning_db');
  define('DB_USER', 'your_db_username');
  define('DB_PASS', 'your_secure_password');
  ```
- [ ] **Set WhatsApp & Support Details**:
  ```php
  define('COMPANY_WHATSAPP_NUMBER', '+44 75 1091 1940');
  define('COMPANY_WHATSAPP_LINK', 'https://wa.me/447510911940');
  define('NOTIFICATION_EMAIL', 'info@oankcleaning.co.uk');
  define('BACKUP_EMAIL', 'hormotholar@yahoo.com');
  define('SUPPORT_EMAIL', 'support@oankcleaning.co.uk');
  ```

---

### Phase 4: Database Setup
- [ ] **Auto Provisioning**:
  `database.php` automatically executes `CREATE DATABASE IF NOT EXISTS` and `CREATE TABLE IF NOT EXISTS enquiries` on the first form submission.
- [ ] **Schema Definition**:
  ```sql
  CREATE DATABASE IF NOT EXISTS `oankcleaning_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  USE `oankcleaning_db`;

  CREATE TABLE IF NOT EXISTS `enquiries` (
      `id` INT AUTO_INCREMENT PRIMARY KEY,
      `reference_no` VARCHAR(50) NOT NULL UNIQUE,
      `name` VARCHAR(255) NOT NULL,
      `email` VARCHAR(255) NOT NULL,
      `phone` VARCHAR(50) DEFAULT NULL,
      `service` VARCHAR(255) DEFAULT NULL,
      `postcode` VARCHAR(50) DEFAULT NULL,
      `preferred_date` VARCHAR(100) DEFAULT NULL,
      `message` TEXT DEFAULT NULL,
      `quote_estimate` DECIMAL(10,2) DEFAULT NULL,
      `status` VARCHAR(50) DEFAULT 'Pending',
      `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  ```

---

### Phase 5: Production Deployment & Server Routing

#### Apache (`.htaccess`) Setup
The `.htaccess` file is pre-configured in `/public/.htaccess` and maps `/api/*` endpoints to `/backend/api/*.php` while serving the SPA for all client routes:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Route /api/* requests to PHP backend scripts
  RewriteRule ^api/contact$ api/contact.php [L,QSA]
  RewriteRule ^api/quote$ api/quote.php [L,QSA]
  RewriteRule ^api/config$ api/config.php [L,QSA]

  # SPA Fallback: Route all non-file requests to index.html
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ index.html [L]
</IfModule>
```

---

### Phase 6: Testing & QA
- [ ] **Contact Form Test**: Submit test message via contact form and verify success response modal with reference number.
- [ ] **Quote Calculator Test**: Calculate quote for End of Tenancy or Office Cleaning, submit enquiry, and check database row in `enquiries`.
- [ ] **Email Delivery Test**: Confirm admin notification email arrives via server `mail()` and customer confirmation email is delivered.
- [ ] **AI Chat Knowledge Test**: Ensure the chat widget answers community questions accurately from `operation.md` and provides the fallback message for unverified inquiries.
- [ ] **CORS Verification**: Open browser DevTools Console to verify no CORS errors occur when communicating with `/api/*`.
