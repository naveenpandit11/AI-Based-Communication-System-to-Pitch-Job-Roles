AI-Based Communication System to Pitch Job Roles

An AI-powered communication system that automatically generates personalized, professional, and context-aware job application emails based on a user's profile and job descriptions. This project enhances job-seeker outreach by creating highly relevant and effective email pitches in seconds.

🚀 Features

🔹 User Management

Create and manage users using a unique User ID

Automatically collect IP address & user-agent logs

Store user profiles with name, email, phone, skills, and experience

🔹 Job Role Management

Add multiple job roles for the same user

Extract structured insights from job descriptions using LLMs

Each job has its own jobId and complete metadata

🔹 AI-Powered Email Generation

Generates highly personalized job application emails

Uses a multi-step process:

Draft generation

Relevance evaluation

Final optimized email

Stores multiple emails per job

🔹 Email Dashboard

View all generated emails grouped by job role

Navigate easily between job roles and their email lists

Option to regenerate emails anytime

🧠 Tech Stack

Frontend

React + Vite

TailwindCSS

React Router

Fetch API

Backend

Node.js

Express.js

MongoDB + Mongoose

Groq LLaMA 3.1 API

🔧 Installation & Setup

1. Clone the Repository
git clone https://github.com/naveenpandit11/AI-Based-Communication-System-to-Pitch-Job-Roles.git
cd yourrepo

📦 Backend Setup

cd backend
npm install

Create .env

MONGO_URI=your_mongodb_uri

GROQ_API_KEY=your_groq_api_key

PORT=7001

Start Backend
npm start

🖥️ Frontend Setup
cd frontend
npm install
npm run dev

🧪 How It Works

1️⃣ User enters a User ID

→ System checks if the user exists
→ Logs IP + device info
→ Redirects to profile or dashboard

2️⃣ User creates a Job Entry

→ AI extracts structured info from JD
→ Job saved under the same userId

3️⃣ User generates emails

→ AI produces draft
→ AI evaluates relevance
→ AI fixes issues and optimizes email
→ Email saved under jobId

4️⃣ User views all emails

→ Dashboard displays emails grouped by job role

📌 Endpoints Overview
User Routes
POST /api/users/checkUser
POST /api/users/add
GET  /api/users/logs/:userId

Profile Routes
POST /api/profile/add
POST /api/profile/checkProfile

Job Routes
POST /api/jobs/create
GET  /api/jobs/user/:id

Email Routes
POST /api/emails/generate-email
GET  /api/emails/:userId/:jobId

🎯 Purpose of the Project

This system helps job seekers quickly craft personalized, high-quality job application emails.
It saves time, improves communication quality, and increases chances of getting interviews.

📄 License

This project is open-source and free to use under the MIT License.
