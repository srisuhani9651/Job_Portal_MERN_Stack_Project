# Job Portal Backend API

This repository contains the backend RESTful API service for the **Job Portal** application, built using Node.js, Express.js (ES Modules), and MongoDB.

---

## 🚀 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js (v5)
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: JWT (JSON Web Tokens) & `cookie-parser`
- **Password Encryption**: `bcryptjs`
- **File Uploads**: `multer`
- **Development Tooling**: `nodemon`

---

## 📁 Directory Structure

```text
Backend/
├── controller/        # Request handlers & core business logic
│   ├── user.controller.js
│   ├── company.controller.js
│   ├── job.controller.js
│   └── application.controller.js
├── middleware/        # Custom Express middlewares (Auth, File upload)
│   ├── isAuthenticated.js
│   └── multer.js
├── models/            # Mongoose schemas & data models
│   ├── user.model.js
│   ├── company.model.js
│   ├── job.model.js
│   └── application.model.js
├── router/            # Express route declarations
│   ├── user.router.js
│   ├── company.route.js
│   ├── job.route.js
│   └── application.route.js
├── utils/             # Database connectivity & helper modules
│   └── db.js
├── index.js           # Server entry point & Express configuration
├── package.json       # Project dependencies & scripts
└── .env               # Environment configuration file
```

---

## ⚙️ Environment Variables

Create a `.env` file in the `Backend/` root directory and populate it with the following configuration:

```env
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/job_portal
SECRET_KEY=your_jwt_secret_key
```

---

## 🛠️ API Reference

All API routes are prefixed with `/api/v1`.

### 👤 User Endpoints (`/api/v1/user`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/register` | Register a new user account (supports file upload) | ❌ |
| `POST` | `/login` | Authenticate user & generate JWT cookie | ❌ |
| `GET` | `/logout` | Clear authentication token cookie | ❌ |
| `POST` | `/profile/update` | Update user profile & resume/avatar details | ✅ |
| `POST` | `/changePassword` | Change account password | ❌ |

### 🏢 Company Endpoints (`/api/v1/company`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/register` | Register a new company profile | ✅ |
| `GET` | `/get/Companies` | Fetch all companies created by recruiter | ✅ |
| `GET` | `/get/Company/:id` | Fetch specific company details by ID | ✅ |
| `PUT` | `/update/:id` | Update company information | ✅ |

### 💼 Job Endpoints (`/api/v1/job`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/postJobs` | Create and post a new job listing | ✅ |
| `GET` | `/get/jobs` | Retrieve all job listings (supports filtering) | ✅ |
| `GET` | `/get/job/:id` | Retrieve job details by job ID | ✅ |
| `GET` | `/recruiter/jobs` | Retrieve all job postings created by logged-in recruiter | ✅ |

### 📑 Application Endpoints (`/api/v1/application`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/apply/:id` | Apply for a job opening | ✅ |
| `GET` | `/get/appliedJobs` | Fetch all applications submitted by candidate | ✅ |
| `GET` | `/:id/applicants` | Fetch applicants for a specific job posting | ✅ |
| `POST` | `/status/:id` | Update job application status (Accepted/Rejected) | ✅ |

---

## 🏃 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) database instance (Local or MongoDB Atlas)

### Setup & Execution

1. **Navigate to the backend directory:**
   ```bash
   cd Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Ensure `.env` exists with valid `MONGO_URI`, `PORT`, and `SECRET_KEY`.

4. **Run Server in Development Mode:**
   ```bash
   npm run dev
   ```

5. Server should now be running at `http://localhost:3000` (or configured `PORT`).
