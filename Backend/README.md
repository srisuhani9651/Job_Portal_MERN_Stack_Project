# JobSphere — Backend Technical & Interview Documentation

> **Complete architectural reference, implementation details, technical request flows, and interview revision guide for the JobSphere Backend.**

---

## 1. Project Overview

**JobSphere** is a full-stack MERN job portal platform that bridges candidates seeking job opportunities with recruiters managing hiring pipelines.

### Core Roles & Permissions
* **Student (Applicant)**:
  * Browse and search jobs with typo-tolerant fuzzy matching.
  * Multi-criteria filtering (Location, Role/Industry, Salary, Dynamic Posted Date, Experience).
  * Apply for jobs and track application status (`pending`, `accepted`, `rejected`).
  * Save jobs for later review.
  * Manage profile details, skill tags, and upload vector PDF resumes.
  * Reset account passwords via HMAC-SHA256 time-based one-time passwords (TOTP) sent via email.
* **Recruiter (Employer / Admin)**:
  * Register and manage company profiles (name, description, website, location, logo).
  * Post, update, and manage job listings.
  * View applicant rosters per job posting with nested applicant profiles and resumes.
  * Update applicant hiring status (`accepted`, `rejected`) in real time.

---

## 2. Architecture & Data Flow

```
[ React Client (Vite) ]
        │
        ▼ HTTP (CORS + withCredentials: true)
[ Express.js REST API Server ]
   ├── [ Middlewares ]
   │      ├── cors (Origin Whitelist & Credentials)
   │      ├── cookie-parser (HTTP-only Cookie Extraction)
   │      ├── multer (In-Memory Buffer File Uploads)
   │      └── isAuthenticated (JWT Verification & req.id Injection)
   ├── [ Controllers ]
   │      ├── user.controller.js (Auth, Profile, Cloudinary PDF, TOTP)
   │      ├── company.controller.js (Company CRUD & Logo Upload)
   │      ├── job.controller.js (Job Postings, Search & Recruiter Feed)
   │      └── application.controller.js (Apply, Status Pipeline, Nested Population)
   └── [ External Services & Storage ]
          ├── MongoDB Atlas (Mongoose ODM — Relational Document Graph)
          ├── Cloudinary (Native Vector PDF Resumes & Company Logos)
          └── Gmail SMTP / Nodemailer (HMAC TOTP Password Reset Delivery)
```

### Key Architectural Decisions
1. **Stateless JWT in HTTP-Only Cookies**:
   * *Why:* Storing JWTs in `httpOnly` cookies mitigates Cross-Site Scripting (XSS) token theft compared to `localStorage`.
2. **Stateless HMAC-SHA256 Time-Based OTP (TOTP)**:
   * *Why:* Instead of polluting the MongoDB database with temporary OTP tables or Redis cache instances, OTPs are computed dynamically on the fly using standard HMAC-SHA256 (`RFC 6238`), email, and timestamp counters.
3. **In-Memory Multer + DataURI Cloudinary Streaming**:
   * *Why:* Files are processed in RAM as memory buffers (`multer.memoryStorage()`) and dispatched directly to Cloudinary as base64 DataURIs, eliminating server disk I/O, temporary file cleanups, and local filesystem vulnerabilities.
4. **Native Vector PDF Cloudinary Delivery**:
   * *Why:* Uploading PDFs with `resource_type: "image"` and `format: "pdf"` allows Cloudinary to serve native vector PDFs directly to browser viewers with `Content-Type: application/pdf`, keeping embedded hyperlinks (LinkedIn, Gmail, Portfolio) interactive and clickable.

---

## 3. Backend Technology Stack & Directory Structure

* **Runtime**: Node.js (ES Modules, `"type": "module"`)
* **Framework**: Express.js (`v5.2.1`)
* **Database**: MongoDB with Mongoose ODM (`v9.7.3`)
* **Security & Auth**: `bcryptjs` (Password hashing, 10 salt rounds), `jsonwebtoken` (Stateless session tokens), `crypto` (HMAC-SHA256 TOTP & `timingSafeEqual`)
* **File Handling**: `multer` (`v2.2.0`), `cloudinary` (`v2.10.0`)
* **Email Service**: `nodemailer` (`v6.10.1`) with Google App Password SMTP
* **Middleware**: `cors`, `cookie-parser`, `dotenv`

```
Backend/
├── controller/
│   ├── application.controller.js  # Apply, applicant review, status updates
│   ├── company.controller.js      # Company registration, update & logo upload
│   ├── job.controller.js          # Job creation, student feed, recruiter jobs, update
│   └── user.controller.js         # Auth, profile, PDF resume, TOTP & password reset
├── middleware/
│   ├── isAuthenticated.js         # JWT cookie validation middleware
│   └── multer.js                  # Multer memory storage configuration
├── models/
│   ├── application.model.js       # Application schema (Job + Applicant references)
│   ├── company.model.js           # Company schema (Name, logo, recruiter reference)
│   ├── job.model.js               # Job schema (Salary, location, experience, company)
│   └── user.model.js              # User schema (Role, profile, skills, resume URL)
├── router/
│   ├── application.route.js       # /api/v1/application routes
│   ├── company.route.js           # /api/v1/company routes
│   ├── job.route.js               # /api/v1/job routes
│   └── user.route.js              # /api/v1/user routes
├── utils/
│   ├── cloudinary.js              # Cloudinary SDK credentials configuration
│   ├── db.js                      # MongoDB connection handler
│   ├── email.js                   # Nodemailer SMTP transporter & email templates
│   └── totp.js                    # RFC 6238 HMAC-SHA256 TOTP generator & rate limiter
├── index.js                       # Express application bootstrap & route mounting
└── package.json                   # Dependencies & start scripts
```

---

## 4. Database Models & Schema Relationships

```
 ┌──────────────────────┐               ┌──────────────────────┐
 │         User         │               │       Company        │
 ├──────────────────────┤               ├──────────────────────┤
 │ _id                  │◄──────────────┤ userId (ref: User)   │
 │ fullName, email      │               │ name, logo, website  │
 │ phoneNumber, password│               │ description, location│
 │ role: Student|Recruit│               └──────────┬───────────┘
 │ profile: {           │                          │
 │   bio, skills[],     │                          │ 1:N
 │   resume, photo,     │                          │
 │   company (ref)      │                          ▼
 └──────────┬───────────┘               ┌──────────────────────┐
            │                           │         Job          │
            │ 1:N                       ├──────────────────────┤
            │ (as applicant)            │ _id                  │
            │                           │ title, description   │
            ▼                           │ requirements[]       │
 ┌──────────────────────┐               │ salary, location     │
 │     Application      │  N:1 (job)    │ experienceLevel      │
 ├──────────────────────┼──────────────►│ company (ref: Company│
 │ _id                  │               │ created_by (ref: User│
 │ job (ref: Job)       │               │ application[] (ref)  │
 │ applicant (ref: User)│               └──────────────────────┘
 │ status: pending |    │
 │   accepted | rejected│
 └──────────────────────┘
```

### Schema Definitions
* **`User`** ([Backend/models/user.model.js](file:///e:/Job-Portal/Backend/models/user.model.js)):
  * `email`: Unique index, trimmed and normalized.
  * `password`: Bcrypt hashed string.
  * `role`: Enum `['Student', 'Recruiter']`.
  * `profile.resume`: Cloudinary HTTPS delivery URL.
  * `profile.skills`: Array of strings.
* **`Company`** ([Backend/models/company.model.js](file:///e:/Job-Portal/Backend/models/company.model.js)):
  * `userId`: Reference to the creating recruiter `User._id`.
  * `logo`: Cloudinary image asset URL.
* **`Job`** ([Backend/models/job.model.js](file:///e:/Job-Portal/Backend/models/job.model.js)):
  * `salary`: Stored as `Number` (LPA or total CTC).
  * `experienceLevel`: Stored as `Number` in years.
  * `company`: Reference to `Company._id`.
  * `created_by`: Reference to `User._id` (Recruiter).
  * `application`: Array of `Application._id` references.
* **`Application`** ([Backend/models/application.model.js](file:///e:/Job-Portal/Backend/models/application.model.js)):
  * `job`: Reference to `Job._id`.
  * `applicant`: Reference to `User._id`.
  * `status`: Enum `['pending', 'accepted', 'rejected']` (default: `'pending'`).

---

## 5. End-to-End Technical Flows

### 1. Registration Flow (`POST /api/v1/user/register`)
`User Signup → Multer (memory) → Cloudinary (profile photo) → Bcrypt (10 rounds) → User.create() → 201 Response`
* Validates required fields (`fullName`, `email`, `phoneNumber`, `password`, `role`).
* Checks for existing email duplicate.
* Hashes password via `bcrypt.hash(password, 10)`.
* If a profile photo file is present, converts buffer to DataURI and uploads to Cloudinary.
* Persists user to MongoDB.

### 2. Authentication & Session Flow (`POST /api/v1/user/login`)
`User Login → Validate Email/Role → Bcrypt.compare() → JWT Sign → Set-Cookie (httpOnly, maxAge: 1d, sameSite: strict) → 200 Response`
* Locates user by `email`.
* Checks role match (`Student` vs `Recruiter`).
* Compares password with `bcrypt.compare(password, user.password)`.
* Issues JSON Web Token signed with `process.env.SECRET_KEY` containing `{ userId: user._id }`.
* Attaches token into HTTP-only cookie with strict security flags.

### 3. Stateless HMAC-SHA256 TOTP Flow (`POST /api/v1/user/forgot-password/send-otp` & `POST /verify-otp`)
`Forgot Password Request → Check Rate Limit → Calculate Counter: floor(epoch / 30s) → HMAC-SHA256(ServerSecret + Email, Counter) → Dynamic Truncate to 6 Digits → Nodemailer SMTP Email → User Inputs OTP → Timing-Safe Comparison across [0, -1] Window → Verified`

#### How HMAC-SHA256 TOTP Works Without Database Storage:
1. **Time Counter**: The server computes `counter = Math.floor(Date.now() / 1000 / 30)`. Every 30 seconds, `counter` increments by 1.
2. **User Unique Key**: A user-specific key is derived via `crypto.createHmac("sha256", SECRET_KEY).update(email).digest()`.
3. **Hash Computation**: Counter is encoded into an 8-byte big-endian binary buffer and hashed with the user key.
4. **Dynamic Truncation**: Standard RFC 4226 offset extraction extracts 4 bytes, applies a binary mask `0x7fffffff`, and performs modulo `1,000,000` to yield a 6-digit numeric string.
5. **Verification Window**: Server generates expected OTP for current offset `0` and previous offset `-1` (tolerates up to 30-60 seconds network/clock latency).
6. **Constant-Time Verification**: Uses `crypto.timingSafeEqual(Buffer.from(userOtp), Buffer.from(expectedOtp))` to prevent timing attacks.
7. **Brute-Force Rate Limiting**: In-memory attempt store locks out email for 5 minutes after 5 consecutive failed attempts.

### 4. Resume PDF Upload Flow (`POST /api/v1/user/profile/update`)
`Profile Form (PDF attached) → Multer (memory buffer) → Cloudinary upload (resource_type: "image", format: "pdf", access_mode: "public") → MongoDB user.profile.resume = secure_url → 200 Response`
* Extracts file from `req.file`.
* Formats as Base64 DataURI: `data:application/pdf;base64,...`.
* Uploads to Cloudinary with `resource_type: "image"` and explicit `format: "pdf"`.
* Cloudinary processes the vector document and returns a secure HTTPS URL that renders natively in browser PDF readers with embedded links preserved.

### 5. Nested Applicant Inspection (`GET /api/v1/application/:id/applicants`)
`Recruiter requests job applicants → verify JWT & req.id → Job.findById(jobId).populate({ path: 'application', populate: { path: 'applicant' } }) → Return full applicant profile + resume URL`

---

## 6. Complete API Reference

| HTTP Method | Route | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/v1/user/register` | No | Register student or recruiter with optional photo |
| `POST` | `/api/v1/user/login` | No | Authenticate user, verify role, set HTTP-only cookie |
| `GET` | `/api/v1/user/logout` | No | Invalidate auth cookie |
| `POST` | `/api/v1/user/profile/update` | Yes | Update profile, bio, skills, and upload PDF resume |
| `POST` | `/api/v1/user/forgot-password/send-otp` | No | Generate and email 30s HMAC-SHA256 TOTP |
| `POST` | `/api/v1/user/forgot-password/verify-otp`| No | Validate OTP using timing-safe comparison |
| `POST` | `/api/v1/user/forgot-password/reset` | No | Verify OTP & update password with Bcrypt hash |
| `POST` | `/api/v1/company/register` | Yes | Register new company name |
| `GET` | `/api/v1/company/get` | Yes | Get all companies created by logged-in recruiter |
| `GET` | `/api/v1/company/get/:id` | Yes | Get single company by ID |
| `PUT` | `/api/v1/company/update/:id` | Yes | Update company profile details and upload logo |
| `POST` | `/api/v1/job/post` | Yes | Create new job listing (Recruiter only) |
| `GET` | `/api/v1/job/get` | Yes | Get all jobs with company population (supports keyword search) |
| `GET` | `/api/v1/job/get/:id` | Yes | Get single job details with company and applications |
| `GET` | `/api/v1/job/getadminjobs` | Yes | Get all jobs posted by current recruiter |
| `PUT` | `/api/v1/job/update/:id` | Yes | Update existing job details |
| `POST` | `/api/v1/application/apply/:id` | Yes | Submit application for a job (prevents duplicates) |
| `GET` | `/api/v1/application/get` | Yes | Get all jobs applied by the current student |
| `GET` | `/api/v1/application/:id/applicants` | Yes | Get nested applicants list for a recruiter's job |
| `POST` | `/api/v1/application/status/:id/update` | Yes | Update applicant status (`accepted` / `rejected`) |

---

## 7. Interview Questions I Should Be Ready For

#### Q1: Why did you use HTTP-only cookies instead of storing the JWT in `localStorage`?
> **Answer:** `localStorage` is accessible via client-side JavaScript, making tokens vulnerable to Cross-Site Scripting (XSS) attacks. HTTP-only cookies cannot be read by `document.cookie`, providing strong protection against token theft. Combined with `sameSite: "strict"` and `secure: true` in production, it also prevents Cross-Site Request Forgery (CSRF).

#### Q2: How does your OTP generation work without storing the OTP in MongoDB or Redis?
> **Answer:** It uses the **Time-Based One-Time Password (TOTP)** algorithm (RFC 6238). The OTP is dynamically calculated using a shared server secret, the user's email, and a 30-second time-step counter `counter = Math.floor(epoch / 30)`. When the user submits the OTP, the server regenerates the hash for the same time window and compares them using `crypto.timingSafeEqual()`. If both match, verification succeeds without ever writing to a database.

#### Q3: Why is `crypto.timingSafeEqual` used instead of standard string equality (`===`) for OTP verification?
> **Answer:** Standard `===` string comparison returns `false` on the first non-matching character, creating small timing variations (timing attack vulnerability) that allow attackers to guess OTP digits. `crypto.timingSafeEqual` executes in constant time regardless of where mismatches occur.

#### Q4: Why did Cloudinary PDF resumes fail with "Failed to load PDF document" previously, and how did you fix it?
> **Answer:** When PDFs are uploaded to Cloudinary as `resource_type: "raw"`, Cloudinary serves them with `Content-Type: application/octet-stream` and `Content-Disposition: attachment`, preventing browser inline rendering. By uploading with `resource_type: "image"` and `format: "pdf"`, Cloudinary delivers the file with `Content-Type: application/pdf; Content-Disposition: inline`, allowing native PDF rendering while preserving embedded hyperlinks (LinkedIn, GitHub).

#### Q5: How do you prevent a student from applying to the same job multiple times?
> **Answer:** In `application.controller.js` (`applyJob`), the backend executes `await Application.findOne({ job: jobId, applicant: userId })`. If an existing record exists, the API rejects the request with HTTP `400` before creating a new document.

#### Q6: How does nested population work in Mongoose for retrieving applicants?
> **Answer:** In `getApplicants`, we populate two levels deep:
> ```javascript
> Job.findById(jobId).populate({
>   path: 'application',
>   populate: { path: 'applicant' }
> })
> ```
> Mongoose first fetches the Job, resolves all referenced `Application` documents by their IDs, and then resolves each `applicant` reference to its corresponding `User` document.

#### Q7: What would you do to scale this backend to 100,000+ daily active users?
> **Answer:**
> 1. **Redis Caching**: Cache `getAllJobs` listings, company profiles, and active sessions with cache-invalidation on new posts.
> 2. **Distributed Rate Limiting**: Move in-memory rate limiting to Redis (`ioredis` / Redis Token Bucket) so rate limits persist across multiple server instances.
> 3. **Database Indexing & Read Replicas**: Add compound indexes on `{ created_by: 1, createdAt: -1 }` and `{ location: 1, salary: 1 }`, and utilize MongoDB read replicas for search queries.
> 4. **Asynchronous Job Queues**: Offload Nodemailer email delivery and Cloudinary uploads to a background worker queue (BullMQ / RabbitMQ).

---

## 8. Environment Variables

Create a `.env` file inside the `Backend/` directory:

```env
# Server Port
PORT=8000

# MongoDB Connection String
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/jobportal?retryWrites=true&w=majority

# JWT & TOTP Secret Key
SECRET_KEY=your_super_secret_random_jwt_and_totp_key

# Cloudinary Storage Credentials
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

# Gmail SMTP Email Dispatcher (For OTPs)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_digit_google_app_password
```

---

## 9. Troubleshooting & Common Setup Gotchas

1. **Gmail SMTP Authentication Errors (`535-5.7.8 Username and Password not accepted`)**:
   * Standard Google account passwords do not work with SMTP. You must generate a **16-digit Google App Password** via Google Account $\rightarrow$ Security $\rightarrow$ 2-Step Verification $\rightarrow$ App Passwords.
2. **CORS Cookie Not Received by Frontend**:
   * Ensure `cors({ origin: 'http://localhost:5173', credentials: true })` is set in `index.js`, and all frontend Axios requests include `withCredentials: true`.
3. **Cloudinary PDF Delivery Blocked**:
   * Ensure "PDF and ZIP files delivery" is enabled in Cloudinary Console $\rightarrow$ Settings $\rightarrow$ Security.
