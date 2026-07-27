# 📝 Blogify: AI-Integrated Blogging Platform

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-blue.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-19.2.0-blue.svg)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-v4.1.18-38bdf8.svg)](https://tailwindcss.com/)
[![Database](https://img.shields.io/badge/database-MongoDB%20Atlas-green.svg)](https://www.mongodb.com/)
[![AI Engine](https://img.shields.io/badge/AI_Engine-Groq_Cloud-orange.svg)](https://groq.com/)

**Blogify** is a modern, high-performance, full-stack blogging platform. Built with React (Vite) and TailwindCSS on the frontend, and Node.js with Express and MongoDB on the backend, it delivers a seamless user experience. Additionally, Blogify features built-in AI tools powered by the Groq API (using the `gpt-oss-20b` model) to assist both creators and readers.

---

## 🚀 Key Features

### 🤖 AI-Powered Integrations
*   **AI Auto-Description:** If you skip writing a description, the platform automatically generates a succinct, 60-character description from your blog content.
*   **AI Smart Tagging:** Automatically extracts 5–7 relevant topics/tags from your blog post for categorisation and search.
*   **Context-Aware Chatbot:** Readers can open a chatbot on any blog post page to ask questions about that specific blog's contents. The AI answers strictly based on the article's text.

### ✍️ Content Creation & Management
*   **Rich Text Editor:** Fully featured interactive text editor powered by **Editor.js** (supporting code blocks, images, lists, quotes, and custom formatting).
*   **Cover Images:** Upload cover images for your blogs using a secure backend file storage system built on **Multer**.
*   **Interactive Engagement:** Likes system, unique view tracking, and reader comments.
*   **Metrics & Read Time:** Automatically tracks and displays cumulative reader interaction times and precise view counts.

### 🔒 Security & Performance
*   **Secure Authentication:** User authentication managed with JWT tokens stored in secure, **HTTP-only cookies** and password hashing.
*   **Spam Protection:** Strict API rate limiting (`express-rate-limit`) applied on authentication, comments, and AI chatbot routes to prevent abuse.
*   **Advanced Search:** Fast search endpoint using MongoDB Atlas fuzzy index searching (`$search` operator) and AI query tag extraction.

---

## 🛠️ Tech Stack

### Frontend
*   **React 19** (Vite template for ultra-fast HMR)
*   **TailwindCSS v4** (Modern styling engine)
*   **React Router DOM** (Single Page App routing)
*   **Editor.js** (Block-style rich-text editor)
*   **Axios** (API requests)

### Backend
*   **Node.js & Express** (Server framework)
*   **MongoDB Atlas** (Database with fuzzy Atlas Search capability)
*   **Mongoose** (ODM)
*   **JWT & Cookie Parser** (User session authentication)
*   **Multer** (File upload handling)
*   **Groq SDK / OpenAI Client** (AI processing engine)
*   **Express Rate Limit** (Traffic protection)

---

## 📂 Project Directory Structure

```text
Blogify/
├── backend/
│   ├── middleware/        # Authentication & protection middleware
│   ├── models/            # MongoDB Schemas (User, Blog, Views, etc.)
│   ├── routes/            # Express route handlers (User, Blog, Comment, Chat)
│   ├── service/           # Helper services (Auth tokens, Groq client wrapper)
│   ├── public/upload/     # Uploaded cover and profile images
│   ├── app.js             # Main server entrypoint
│   ├── .env               # Server configurations & secret keys
│   └── package.json       # Backend dependencies
│
├── frontend/
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── assets/        # CSS & images
│   │   ├── components/    # Layout, Home, BlogPage, Login, Profile components
│   │   ├── context/       # User & Blog React Context providers
│   │   ├── main.jsx       # Client entrypoint and routing configuration
│   │   └── index.css      # Core tailwind styles
│   ├── vite.config.js     # Dev server proxy configs
│   ├── .env               # Client-side configuration variables
│   └── package.json       # Frontend dependencies
```

---

## ⚙️ Environment Configuration

You must create and configure `.env` files in both directories before launching the application.

### Backend Configurations
Create `/backend/.env`:
```env
# MongoDB Atlas Connection URI
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/your-db-name

# Server Port
PORT=3000

# JWT Auth Secret
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# CORS Allowed Origin
CLIENT_URL=http://localhost:5173

# Groq Cloud API Key (using OpenAI-compatible base URL)
OPENAI_API_KEY=gsk_your_groq_api_key_here
```

### Frontend Configurations
Create `/frontend/.env`:
```env
# Backend API Base URL
VITE_BACKEND_URL=http://localhost:3000
```

---

## 🏃 Getting Started & Local Installation

### Prerequisites
*   [Node.js](https://nodejs.org/en) (v18.x or higher recommended)
*   MongoDB Atlas Account (or local MongoDB server)
*   Groq Cloud Account API Key

### Installation Steps

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/Blogify.git
    cd Blogify
    ```

2.  **Configure Environment Variables:**
    Set up the `.env` files in both `backend/` and `frontend/` folders as shown in the [Environment Configuration](#-environment-configuration) section.

3.  **Install & Run Backend:**
    ```bash
    cd backend
    npm install
    npm run dev
    ```
    *The server will start listening at `http://localhost:3000`.*

4.  **Install & Run Frontend:**
    Open a new terminal window, then run:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    *Vite will compile assets and serve the application at `http://localhost:5173/`.*

---

## 🔌 API Endpoints Summary

### User Routes (`/user`)
*   `POST /api/signup` — Register a new account (accepts profile image upload).
*   `POST /api/login` — Sign in and receive a session cookie.
*   `POST /api/logout` — Clear the session cookie.
*   `GET /api/me` — Fetch current logged-in user profile.
*   `POST /api/managelike` — Toggle a user's liked blogs list.
*   `GET /api/:id` — Fetch public profiles of other users.

### Blog Routes (`/blog`)
*   `POST /api/create` — Publish a new blog post (AI description and tags are generated if missing).
*   `GET /api/all` — Fetch all published blog posts.
*   `GET /api/search` — Search blogs using fuzzy aggregation indexes.
*   `GET /api/:id` — View details of a specific blog post.
*   `PUT /api/:id/update` — Update title, content, or cover image.
*   `POST /api/:id/delete` — Remove a blog post.
*   `POST /api/:id/like` — Toggle liking a blog.
*   `POST /api/:id/view` — Increment view count uniquely.
*   `POST /api/:id/read-time` — Update reader session interactive read time.

### AI Chat Route (`/chat`)
*   `POST /api/ask` — Submit questions about a blog's text to receive answers generated based strictly on the blog content.
