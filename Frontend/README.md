# JobSphere — Frontend Technical & Interview Documentation

> **Complete architectural reference, state management guide, algorithm explanations, technical request flows, and interview revision guide for the JobSphere Frontend.**

---

## 1. Project Overview

**JobSphere Frontend** is a modern Single Page Application (SPA) built with **React**, **Redux Toolkit**, **Tailwind CSS**, and **Vite**. It provides dedicated workspaces for both **Students/Job Seekers** and **Recruiters/Employers**.

### Core User Experiences
* **Student Workspace**:
  * **Home**: Hero section with quick search, popular job domain carousel, and latest jobs showcase.
  * **Browse Jobs**: Real-time typo-tolerant fuzzy search across titles, company names, locations, and requirements.
  * **Jobs Feed**: Multi-select, multi-criteria filtering by Location, Role/Industry, Salary range, Dynamic posted date (<24h, 3d, 7d), and Required Experience.
  * **Job Details**: Comprehensive job description, requirements checklist, company info, and 1-click application submission with duplicate prevention.
  * **Saved for Later**: Bookmark opportunities to a personal saved list with instant toggle sync.
  * **Career Activities (`/applied-jobs`)**: Dual-pane dashboard tracking application statuses (`pending`, `accepted`, `rejected`) and saved jobs.
  * **Profile Management**: Profile picture, bio, skills array, and vector PDF resume viewer with active hyperlinks.
  * **Forgot Password**: Multi-step TOTP email verification flow with real-time countdown timer.
* **Recruiter Workspace**:
  * **Company Management**: Register and configure company profiles, descriptions, websites, and logos.
  * **Job Management**: Create and edit job postings (salary in LPA, positions, requirements, experience).
  * **Applicant Tracker**: View applicant rosters per job, review candidate PDF resumes, and update hiring status.

---

## 2. Architecture & Data Flow

```
[ Browser / User Actions ]
       │
       ▼
[ React Component Hierarchy ]
       │
       ├── [ UI Primitives (Shadcn / Radix UI + Lucide Icons) ]
       ├── [ Custom Data-Fetching Hooks (useGetAllJobs, etc.) ]
       └── [ Redux Toolkit Store (Single Source of Truth) ]
              ├── authSlice (user session, loading states)
              ├── jobSlice (allJobs, adminJobs, singleJob, savedJobs, filters)
              ├── companySlice (companies list, singleCompany, searchCompanyByText)
              └── applicationSlice (applicants list, status)
       │
       ▼ Axios HTTP Client (withCredentials: true)
[ Backend Express REST API ]
```

---

## 3. Technology Stack & Key Libraries

* **Framework & Build Tool**: React 18 + Vite
* **Routing**: `react-router-dom` (v6) with client-side route protection
* **State Management**: `@reduxjs/toolkit` + `react-redux`
* **Styling**: Tailwind CSS + `tailwind-merge` + `clsx`
* **UI Components**: Radix UI primitives (`@radix-ui/react-dialog`, `@radix-ui/react-popover`, `@radix-ui/react-radio-group`, `@radix-ui/react-avatar`), `lucide-react`
* **Notifications**: `sonner` (Toast notifications)
* **HTTP Client**: `axios` (Configured with credentials and base API constants)
* **Animation & Motion**: Tailwind transitions, dynamic hover micro-animations

---

## 4. State Management Architecture (Redux Toolkit)

The application maintains a centralized store configured in [Frontend/src/Redux/store.js](file:///e:/Job-Portal/Frontend/src/Redux/store.js) with 4 primary slices:

```
Redux Store
├── auth: {
│     user: Object | null,
│     loading: Boolean
│   }
├── jobs: {
│     allJobs: Array<Job>,
│     allAdminJobs: Array<Job>,
│     singleJob: Object | null,
│     savedJobs: Array<String> (Synced with localStorage),
│     searchJobByText: String,
│     allAppliedJobs: Array<Application>,
│     isLoading: Boolean,
│     error: String | null
│   }
├── company: {
│     singleCompany: Object | null,
│     companies: Array<Company>,
│     searchCompanyByText: String
│   }
└── application: {
      applicants: Object | null (Job with populated applicants array)
    }
```

### Custom Hooks
* **`useGetAllJobs`** ([Frontend/src/hooks/useGetAllJobs.jsx](file:///e:/Job-Portal/Frontend/src/hooks/useGetAllJobs.jsx)): Dispatches `setAllJobs` when the user is logged in.
* **`useGetAllAdminJobs`** ([Frontend/src/hooks/useGetAllAdminJobs.jsx](file:///e:/Job-Portal/Frontend/src/hooks/useGetAllAdminJobs.jsx)): Fetches jobs created specifically by the authenticated recruiter.
* **`useGetAllCompanies`** ([Frontend/src/hooks/useGetAllCompanies.jsx](file:///e:/Job-Portal/Frontend/src/hooks/useGetAllCompanies.jsx)): Loads recruiter companies for job creation and company management tables.
* **`useGetCompanyById`** ([Frontend/src/hooks/useGetCompanyById.jsx](file:///e:/Job-Portal/Frontend/src/hooks/useGetCompanyById.jsx)): Fetches company data for the company update form.
* **`useGetAllAppliedJobs`** ([Frontend/src/hooks/useGetAllAppliedJobs.jsx](file:///e:/Job-Portal/Frontend/src/hooks/useGetAllAppliedJobs.jsx)): Fetches submitted applications for the candidate application tracker.

---

## 5. Intelligent Search & Filtering Algorithms

### 1. Typo-Tolerant Fuzzy Search ([Frontend/src/utils/fuzzySearch.js](file:///e:/Job-Portal/Frontend/src/utils/fuzzySearch.js))
The `/browse` page features an intelligent client-side fuzzy search engine that combines three distinct matching layers:
1. **Direct & Substring Match**: Checks if the normalized query is directly included in the job's title, description, company, location, or requirements.
2. **Domain Synonyms Dictionary**: Maps technical terms to related aliases (e.g. searching `"React"` matches `"frontend"`, `"javascript"`, `"ui"`, `"web"`; searching `"Node"` matches `"backend"`, `"express"`, `"server"`).
3. **Levenshtein Distance Metric**: Dynamically calculates the edit distance between search tokens and job tokens. Tolerates up to 1 typo for short words ($\le 4$ chars), 2 typos for medium words ($\le 7$ chars), and 3 typos for longer words.

```javascript
// Levenshtein Distance Matrix Calculation
export const levenshteinDistance = (a, b) => {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
};
```

### 2. Multi-Select, Multi-Facet Job Filtering ([Frontend/src/components/Jobs.jsx](file:///e:/Job-Portal/Frontend/src/components/Jobs.jsx))
Supports combined multi-category filtering:
* **Facets**: `Location`, `Industry`, `Salary`, `Posted Within`, `Experience`.
* **Behavior**: **OR logic within the same facet** (e.g. selecting `Bangalore` + `Pune` returns jobs in either city) and **AND logic across different facets** (e.g. `Bangalore` AND `Frontend Developer` AND `1–3 Years`).
* **Dynamic Time Windowing**: Calculates elapsed hours from `job.createdAt` relative to `new Date()` (Last 24h, 3 days, 7 days) without hardcoded dates.
* **Salary Normalization**: Normalizes both LPA and raw INR values into consistent brackets.

---

## 6. End-to-End Technical Flows

```
========================================================================================
1. USER LOGIN FLOW
========================================================================================
User submits Login Form
  │
  ▼
Frontend dispatches axios.post('/api/v1/user/login', { email, password }, { withCredentials: true })
  │
  ▼
Backend validates credentials, signs JWT, and responds with HTTP-only cookie + user object
  │
  ▼
Frontend dispatches Redux dispatch(setUser(res.data.user))
  │
  ▼
Navigate based on role:
  - If Recruiter ──► navigate('/admin/companies')
  - If Student   ──► navigate('/')

========================================================================================
2. JOB APPLICATION FLOW
========================================================================================
Student clicks "Apply Now" on JobDescription.jsx
  │
  ▼
Frontend dispatches axios.post(`/api/v1/application/apply/${jobId}`, {}, { withCredentials: true })
  │
  ▼
Backend checks if application already exists:
  - If exists: returns HTTP 400 "You have applied for this job"
  - If new: creates Application record, pushes ID to job.application[], returns HTTP 201
  │
  ▼
Frontend triggers toast.success("Job applied successfully") and sets local isApplied = true

========================================================================================
3. SAVE JOB FOR LATER FLOW (User-Specific)
========================================================================================
Student clicks bookmark / "Save For Later" on JobCard.jsx
  │
  ▼
Check Authentication (if unauthenticated → prompt login)
  │
  ▼
Frontend executes dispatch(toggleSaveJob({ jobId: job._id, userId: user._id }))
  │
  ├── Redux state: adds/removes jobId from state.jobs.savedJobs array for current user
  └── LocalStorage: writes updated array to user-isolated localStorage.setItem(`savedJobs_${userId}`, ...)
  │
  ▼
- UI instantly updates bookmark icon fill color and button label to "Saved"
- /applied-jobs "Saved for Later" section displays only current student's saved opportunities
- Switching/logging out clears Redux state so other accounts never see cross-user bookmarks
```

---

## 7. Key Code Locations Reference Table

| Feature / Domain | Frontend Location | Backend Location | Functional Role |
| :--- | :--- | :--- | :--- |
| **Authentication & Session** | `Frontend/src/components/auth/Login.jsx`<br>`Frontend/src/components/auth/Signup.jsx` | `Backend/controller/user.controller.js`<br>`Backend/middleware/isAuthenticated.js` | User registration, login with HTTP-only cookie JWT, logout |
| **Password Reset (TOTP)** | `Frontend/src/components/auth/ForgotPassword.jsx` | `Backend/utils/totp.js`<br>`Backend/utils/email.js` | 30s HMAC-SHA256 time-based OTP generation & Gmail SMTP delivery |
| **Fuzzy Job Search** | `Frontend/src/components/Browse.jsx`<br>`Frontend/src/utils/fuzzySearch.js` | `Backend/controller/job.controller.js` | Levenshtein distance typo tolerance + tech synonym lookup |
| **Multi-Facet Job Filtering** | `Frontend/src/components/Jobs.jsx`<br>`Frontend/src/components/FilterCard.jsx` | `Backend/controller/job.controller.js` | Multi-select filters for Location, Industry, Salary, Date, Experience |
| **Saved Jobs for Later** | `Frontend/src/components/AppliedJobs.jsx`<br>`Frontend/src/components/JobCard.jsx` | `Frontend/src/Redux/jobSlice.js` (Redux + LocalStorage) | Bookmark jobs, real-time unbookmark, dedicated Saved list |
| **Application Pipeline** | `Frontend/src/components/AppliedJobTable.jsx`<br>`Frontend/src/components/JobDescription.jsx` | `Backend/controller/application.controller.js` | Candidate job submission, status tracking, recruiter review |
| **Resume PDF Viewer** | `Frontend/src/components/Profile.jsx`<br>`Frontend/src/components/admin/ApplicantsTable.jsx` | `Backend/controller/user.controller.js`<br>`Backend/utils/cloudinary.js` | Native vector PDF delivery preserving interactive hyperlinks |
| **Recruiter Management** | `Frontend/src/components/admin/Companies.jsx`<br>`Frontend/src/components/admin/PostJobs.jsx` | `Backend/controller/company.controller.js`<br>`Backend/controller/job.controller.js` | Company registration, logo upload, job creation & edits |

---

## 8. Interview Questions I Should Be Ready For

#### Q1: Why did you implement client-side fuzzy search instead of relying solely on MongoDB `$regex`?
> **Answer:** MongoDB `$regex` only performs substring matching and fails on typos (e.g. searching `"recat"` returns 0 results for `"react"`) and synonyms (e.g. searching `"frontend"` does not match `"React Developer"`). Our frontend fuzzy search incorporates **Levenshtein Distance** for typo tolerance and a **Domain Synonym Dictionary** for semantic discovery, providing instant zero-latency filtering as the user types without overloading the backend database with keystroke requests.

#### Q2: How does the multi-criteria job filtering combine multiple selections?
> **Answer:** The filtering uses a `useMemo` hook that runs in $O(N)$ time against `allJobs`. Within a specific category (e.g. Location), it uses **OR logic** (`some()` match across selected locations). Across different categories, it applies **AND logic** (a job must satisfy the selected Location criteria, Industry criteria, Salary bracket, dynamic Date threshold, and Experience level).

#### Q3: How do you ensure protected routes and prevent students from accessing recruiter views?
> **Answer:** We enforce client-side route guards using `useSelector((store) => store.auth)`. If a student attempts to navigate to `/admin/companies` or `/admin/jobs`, `useEffect` hooks in those components detect `user.role !== "Recruiter"` and redirect them to `/`. Additionally, the backend strictly verifies `req.id` on all admin mutations.

#### Q4: Why did you sync `savedJobs` with `localStorage` in Redux?
> **Answer:** Storing bookmarked jobs in `localStorage` alongside Redux Toolkit provides immediate persistence across page refreshes and browser restarts without requiring additional database roundtrips. When the student clicks "Save for Later", Redux updates state synchronously for instantaneous UI feedback while persisting the IDs in `localStorage`.

#### Q5: How do you handle file uploads for PDF resumes without corrupting vector hyperlinks?
> **Answer:** We upload resumes to Cloudinary using `resource_type: "image"` and `format: "pdf"`. In the frontend, the resume URL is rendered in an `<a>` tag with `target="_blank"` and `rel="noopener noreferrer"`. This instructs the browser to open the vector PDF in a native PDF tab with clickable external hyperlinks (Gmail, LinkedIn, Portfolio).

---

## 9. Environment Variables

Create a `.env` file in the `Frontend/` root directory (if customizing API endpoints):

```env
# Backend API Base URL (defaults to localhost:8000 in development)
VITE_API_BASE_URL=http://localhost:8000
```

---

## 10. Future Production Improvements

1. **Server-Side Pagination & Infinite Scroll**: Implement cursor-based pagination for `allJobs` to optimize memory when listings exceed 10,000+ jobs.
2. **WebSockets for Application Status**: Integrate `Socket.io` to notify candidates instantly when a recruiter changes their application status (`accepted` / `rejected`).
3. **PWA & Offline Mode**: Add a service worker to cache viewed jobs and allow offline browsing.
