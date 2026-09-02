# Readify-AI

> AI-powered interview preparation and resume optimization platform.

Readify-AI is a full-stack web application that helps candidates prepare for job interviews by analyzing their resume against a target job description.

Users can upload their resume, provide a job description and self-description, and receive an AI-generated interview preparation report containing a match score, technical interview questions, behavioral questions, skill gaps, and a personalized preparation plan.

The application also provides AI-assisted resume PDF generation based on the analyzed candidate information.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [How It Works](#how-it-works)
- [Application Flow](#application-flow)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Interview Reports](#interview-reports)
- [AI Integration](#ai-integration)
- [Resume Processing](#resume-processing)
- [Resume PDF Generation](#resume-pdf-generation)
- [Frontend Pages](#frontend-pages)
- [Database](#database)
- [Security and Privacy](#security-and-privacy)
- [Current Limitations](#current-limitations)
- [Future Improvements](#future-improvements)
- [Demo Flow](#demo-flow)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Preparing for an interview often requires candidates to manually:

- Compare their resume with a job description
- Identify missing or weak skills
- Research potential interview questions
- Prepare technical questions
- Prepare behavioral questions
- Create a structured preparation plan
- Improve their resume for a specific role

Readify-AI brings these tasks into one application.

The user provides:

1. A resume in PDF format
2. A target job description
3. A short self-description

Readify-AI processes this information using AI and generates a personalized interview preparation report.

The generated report helps candidates understand:

- How well their profile matches the target role
- Which technical topics they should prepare
- Which behavioral questions they may encounter
- Which skills they need to improve
- How they can structure their preparation

---

## Features

### Authentication

Readify-AI provides:

- User registration
- User login
- Current authenticated user retrieval
- Logout
- Protected frontend routes
- Authentication-protected backend routes
- Cookie-based authentication
- User-specific interview reports

Users can only access interview reports associated with their account.

### Resume Upload

Users can upload their resume as a PDF file.

The backend extracts the text from the uploaded PDF before sending the relevant information to the AI service.

### AI-Powered Interview Analysis

The application analyzes:

- Resume
- Job description
- Self-description

The AI generates a structured interview preparation report containing:

- Match score
- Technical interview questions
- Behavioral interview questions
- Skill gaps
- Preparation plan

### Match Score

The AI generates a match score representing the alignment between the candidate's profile and the target job description.

### Technical Interview Questions

Each generated technical question contains:

- Question
- Intention
- Answer field

### Behavioral Interview Questions

Each generated behavioral question contains:

- Question
- Intention
- Answer field

### Skill Gap Analysis

Each identified skill gap contains:

- Skill
- Severity

Severity levels:

```text
low
medium
high
```

### Personalized Preparation Plan

The AI generates a preparation plan containing:

- Day
- Focus
- Tasks

### Previous Interview Reports

Authenticated users can retrieve their previously generated interview reports.

### Resume PDF Generation

Users can generate a resume PDF based on the information stored in an interview report.

The backend:

1. Retrieves the user's interview report
2. Sends the relevant information to the AI service
3. Generates HTML content
4. Uses Puppeteer to render the HTML
5. Returns the generated PDF to the frontend

### Navigation

Authenticated pages contain a navigation bar with:

- Readify-AI branding
- Home navigation
- Logout functionality

The Readify-AI logo can be clicked to return to the Home page.

### Informational Pages

The application includes:

- Privacy Policy
- Terms of Service
- Help Center

---

## How It Works

```text
User
  |
  v
Register / Login
  |
  v
Home Page
  |
  v
Upload Resume
  |
  +---- Job Description
  |
  +---- Self Description
  |
  v
Express Backend
  |
  v
Extract Resume Text
  |
  v
Google Gemini AI
  |
  v
Structured Interview Report
  |
  +---- Match Score
  |
  +---- Technical Questions
  |
  +---- Behavioral Questions
  |
  +---- Skill Gaps
  |
  +---- Preparation Plan
  |
  v
MongoDB
  |
  v
Interview Report
  |
  v
Resume PDF Generation
```

---

## Application Flow

```text
Register
   |
   v
Login
   |
   v
Home
   |
   v
Upload Resume
   |
   v
Enter Job Description
   |
   v
Enter Self Description
   |
   v
Generate Interview Report
   |
   v
Review Match Score
   |
   v
Review Technical Questions
   |
   v
Review Behavioral Questions
   |
   v
Review Skill Gaps
   |
   v
Review Preparation Plan
   |
   v
Generate Resume PDF
   |
   v
Download Resume
   |
   v
Logout
```

---

## Tech Stack

### Frontend

- React
- React Router
- Axios
- SCSS
- Vite

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Multer
- PDF parsing

### AI

- Google Gemini
- `@google/genai`
- Zod
- `zod-to-json-schema`

### PDF Generation

- Puppeteer

---

## Project Structure

```text
Readify-AI/
|
+-- Backend/
|   |
|   +-- controllers/
|   |   +-- auth.controller.js
|   |   +-- interview.controller.js
|   |
|   +-- middlewares/
|   |   +-- auth.middleware.js
|   |   +-- file.middleware.js
|   |
|   +-- models/
|   |   +-- user.model.js
|   |   +-- interviewReport.model.js
|   |
|   +-- routes/
|   |   +-- auth.routes.js
|   |   +-- interview.routes.js
|   |
|   +-- services/
|   |   +-- ai.service.js
|   |
|   +-- app.js
|   +-- server.js
|   +-- package.json
|   +-- .env
|
+-- Frontend/
|   |
|   +-- src/
|       |
|       +-- features/
|       |   |
|       |   +-- auth/
|       |   |   +-- components/
|       |   |   +-- hooks/
|       |   |   +-- pages/
|       |   |   +-- services/
|       |   |   +-- auth.context.jsx
|       |   |
|       |   +-- interview/
|       |       +-- components/
|       |       +-- hooks/
|       |       +-- pages/
|       |       +-- services/
|       |       +-- style/
|       |
|       +-- App.jsx
|       +-- app.routes.jsx
|
+-- .gitignore
+-- README.md
```

---

## Prerequisites

Before running Readify-AI locally, make sure you have:

- Node.js
- npm
- MongoDB or MongoDB Atlas
- Google Gemini API access
- Git

Check Node.js:

```bash
node --version
```

Check npm:

```bash
npm --version
```

---

## Environment Variables

Create a `.env` file inside the `Backend` directory.

Example:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_API_KEY=your_google_gemini_api_key
```

> Use the exact environment variable names expected by your backend configuration.

Never commit real credentials to GitHub.

Recommended `.gitignore` entries:

```gitignore
node_modules/
.env
.env.local
.env.*.local
```

---

## Installation

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd Readify-AI
```

### 2. Install Backend Dependencies

```bash
cd Backend
npm install
```

### 3. Install Frontend Dependencies

Open another terminal:

```bash
cd Frontend
npm install
```

---

## Running the Application

The frontend and backend should run at the same time during development.

### Start the Backend

From the `Backend` directory:

```bash
npm run dev
```

If your backend uses a `start` script instead:

```bash
npm start
```

The backend runs on:

```text
http://localhost:3000
```

### Start the Frontend

From the `Frontend` directory:

```bash
npm run dev
```

Vite will display the local frontend URL, typically:

```text
http://localhost:5173
```

---

## API Documentation

### Authentication API

Base path:

```text
/api/auth
```

#### Register

```http
POST /api/auth/register
```

Creates a new user account.

Example request:

```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login

```http
POST /api/auth/login
```

Authenticates a user.

Example request:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User

```http
GET /api/auth/me
```

Returns the currently authenticated user.

#### Logout

```http
POST /api/auth/logout
```

Logs the authenticated user out.

---

### Interview API

Base path:

```text
/api/interview
```

Interview endpoints require authentication.

#### Generate Interview Report

```http
POST /api/interview
```

Accepts multipart form data.

Fields:

```text
resume
jobDescription
selfDescription
```

The `resume` field contains the uploaded PDF.

Processing:

```text
Request
  |
  v
Authentication
  |
  v
Resume Upload
  |
  v
PDF Text Extraction
  |
  v
AI Analysis
  |
  v
Zod Validation
  |
  v
MongoDB Storage
  |
  v
Response
```

#### Get Interview Report

```http
GET /api/interview/report/:interviewId
```

Returns a specific interview report belonging to the authenticated user.

#### Get All Interview Reports

```http
GET /api/interview
```

Returns the authenticated user's interview reports.

Large report fields are excluded from the listing response to keep the response lightweight.

#### Generate Resume PDF

```http
POST /api/interview/resume/pdf/:interviewReportId
```

Generates a resume PDF using the selected interview report.

Response content type:

```text
application/pdf
```

---

## Authentication

The frontend Axios client sends credentials with API requests.

Example:

```javascript
const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
});
```

The backend enables credentialed CORS:

```javascript
cors({
    origin: "http://localhost:5173",
    credentials: true,
});
```

Protected interview routes use authentication middleware.

User-specific resources are checked against the authenticated user's ID.

---

## Interview Reports

Each generated interview report contains information such as:

```text
title
jobDescription
resume
selfDescription
matchScore
technicalQuestions
behavioralQuestions
skillGaps
preparationPlan
user
createdAt
updatedAt
```

### Match Score

Represents the AI-generated alignment between the candidate and the target job.

### Technical Questions

Each technical question contains:

```text
question
intention
answer
```

### Behavioral Questions

Each behavioral question contains:

```text
question
intention
answer
```

### Skill Gaps

Each skill gap contains:

```text
skill
severity
```

Possible severity values:

```text
low
medium
high
```

### Preparation Plan

Each preparation plan entry contains:

```text
day
focus
tasks
```

---

## AI Integration

Readify-AI uses Google Gemini to generate interview preparation content.

The AI receives:

```text
Resume
Job Description
Self Description
```

and generates a structured response.

The AI service uses:

- `@google/genai`
- Gemini
- Zod
- `zod-to-json-schema`

The configured Gemini model is:

```text
gemini-3.1-flash-lite
```

### Structured AI Output

The generated AI response is validated using Zod before being stored.

This helps ensure that the generated data follows the structure expected by the application.

The report structure includes:

```text
Match Score
Technical Questions
Behavioral Questions
Skill Gaps
Preparation Plan
```

---

## Resume Processing

Users upload resumes in PDF format.

The backend extracts text from the PDF before using the content for AI analysis.

The process is:

```text
PDF Resume
    |
    v
File Upload
    |
    v
PDF Parser
    |
    v
Extracted Text
    |
    v
Gemini AI
    |
    v
Interview Report
```

---

## Resume PDF Generation

Readify-AI can generate a resume PDF using the information from an interview report.

The process is:

```text
Interview Report
       |
       v
AI Resume Generation
       |
       v
Generated HTML
       |
       v
Puppeteer
       |
       v
PDF Buffer
       |
       v
Frontend Download
```

The backend returns the generated file with:

```http
Content-Type: application/pdf
```

---

## Frontend Pages

### Register

Route:

```text
/register
```

Allows new users to create an account.

### Login

Route:

```text
/login
```

Allows existing users to authenticate.

### Home

Route:

```text
/
```

The main dashboard for authenticated users.

Users can:

- Upload a resume
- Enter a job description
- Enter a self-description
- Generate an interview report
- View previous reports

### Interview Report

Route:

```text
/interview/:interviewId
```

Displays:

- Match score
- Technical questions
- Behavioral questions
- Skill gaps
- Preparation plan
- Resume PDF generation

### Privacy Policy

Route:

```text
/privacy-policy
```

Provides information about how application data is handled.

### Terms of Service

Route:

```text
/terms-of-service
```

Provides the application's terms of use.

### Help Center

Route:

```text
/help
```

Provides information about the application and common questions.

---

## Database

Readify-AI uses MongoDB with Mongoose.

### User Model

Stores user account information and authentication-related data.

### Interview Report Model

Stores generated interview preparation reports.

Reports are associated with the user who generated them.

The interview report contains fields such as:

```text
title
jobDescription
resume
selfDescription
matchScore
technicalQuestions
behavioralQuestions
skillGaps
preparationPlan
user
createdAt
updatedAt
```

---

## Security and Privacy

Readify-AI handles potentially sensitive information such as:

- Resume content
- Job descriptions
- Self-description
- Authentication information
- Interview reports

The application uses:

- Authentication middleware
- Protected frontend routes
- User ownership checks
- Credential-based authentication
- Environment variables for secrets
- AI response validation
- User-associated MongoDB documents
- `.env` exclusion from version control

### User Data Isolation

When retrieving an interview report, the backend checks both:

```text
interviewReportId
```

and:

```text
user
```

This prevents an authenticated user from accessing another user's interview report.

---

## Production Security Considerations

Before deploying the application publicly, additional security hardening should be considered.

Recommended improvements include:

- HTTPS
- Secure cookie configuration
- Strong production secrets
- Production CORS configuration
- Rate limiting
- File size limits
- Strict file type validation
- Input validation
- MongoDB security configuration
- Error monitoring
- Application logging
- AI API usage limits

---

## Current Limitations

The current version focuses on the core MVP interview preparation workflow.

The following features are not currently part of the MVP:

- Real-time AI interview simulation
- Voice-based interviews
- Speech recognition
- Interview performance analytics
- Advanced progress tracking
- Email notifications
- Social authentication
- Multiple resume versions
- Job recommendation system
- Multi-language interview preparation
- Advanced interview history analytics

---

## Future Improvements

Possible future improvements include:

### AI Interview Simulator

Allow users to conduct interactive mock interviews with an AI interviewer.

### Voice-Based Interviews

Add speech recognition and text-to-speech capabilities for realistic interview practice.

### Progress Tracking

Track preparation progress over time, including completed tasks and improvement areas.

### Resume Version Management

Allow users to create and manage multiple resume versions for different job applications.

### Job Matching

Allow users to compare their resume against multiple job descriptions.

### Interview Analytics

Provide analytics across multiple interview preparation reports.

### Notifications

Add reminders and notifications for interview preparation tasks.

### Multi-Language Support

Support interview preparation in multiple languages.

---

## Demo Flow

The core MVP can be demonstrated with this workflow:

```text
Login
  |
  v
Home
  |
  v
Upload Resume
  |
  v
Enter Job Description
  |
  v
Enter Self Description
  |
  v
Generate Report
  |
  v
Explore Report
  |
  +---- Match Score
  |
  +---- Technical Questions
  |
  +---- Behavioral Questions
  |
  +---- Skill Gaps
  |
  +---- Preparation Plan
  |
  v
Generate Resume PDF
  |
  v
Download Resume
  |
  v
Logout
```

---

## Development Architecture

### Backend

```text
Routes
   |
   v
Controllers
   |
   v
Services
   |
   v
Models
   |
   v
MongoDB
```

### Frontend

```text
Pages
   |
   v
Hooks / Context
   |
   v
API Services
   |
   v
Backend API
```

This separation keeps the application easier to maintain and extend.

---

## Loading States

The frontend provides loading states for asynchronous operations.

Initial authentication and data loading can display a full-screen loading state.

User actions such as logout use action-specific loading states such as:

```text
Logging out...
```

This prevents individual actions from unnecessarily replacing the entire page with a global loading screen.

---

## Error Handling

The backend uses HTTP status codes to communicate request results.

Common responses include:

```text
200 OK
201 Created
404 Not Found
```

For example:

```json
{
  "message": "Interview report not found"
}
```

---

## Git Workflow

Create a feature branch:

```bash
git checkout -b feature/your-feature
```

Stage your changes:

```bash
git add .
```

Commit:

```bash
git commit -m "Add your feature"
```

Push:

```bash
git push origin feature/your-feature
```

---

## Contributing

Contributions and suggestions are welcome.

To contribute:

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test the application locally.
5. Commit your changes.
6. Push your branch.
7. Open a pull request.

---

## License

This project is currently intended as a personal/portfolio project.

If you plan to distribute or commercialize the project, add an appropriate open-source or proprietary license.

---

## Author

Built as a full-stack AI-powered interview preparation project using:

```text
React
Node.js
Express.js
MongoDB
Google Gemini
Puppeteer
```

---

## Readify-AI

**Upload your resume. Understand your gaps. Prepare smarter.**
