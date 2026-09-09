# 🌌 Noveland

> A modern, full-stack community platform and discussion forum for web novels, light novels, and serialized fiction.

Noveland brings novel readers, authors, and translators together in a unified hub. Discover translated stories, delve into dedicated novel discussion boards, formulate chapter theories, review translations, and seamlessly search & import light novels from **RanobeDB** and **Open Library**.

---

## ✨ Features

### 📖 1. Novel Discovery & Catalog
- **Rich Novel Profiles**: Cover artwork, author info, status (*Ongoing*, *Completed*), reader ratings, and chapter counts.
- **Category & Genre Filters**: *Fantasy*, *Action*, *Adventure*, *Sci-Fi*, *Cultivation*, *Romance*, *Mystery*, etc.
- **Dedicated Discussion Tab**: Every novel has an embedded forum board aggregating all community threads specifically discussing that novel.

### 💬 2. Interactive Community Forum
- **Forum Categories**:
  - 🔮 **Theories & Lore**: Speculate on upcoming plot twists and magical power systems.
  - ⚔️ **Chapter Spoilers**: Dedicated discussions for raw and advance release chapters.
  - ⭐ **Reviews & Ratings**: Comprehensive spoiler-free critiques and recommendations.
  - 📚 **Novel Discussions**: General discussions bound to specific titles.
  - 💡 **Recommendations**: Curated reading lists and hidden gems.
  - ☕ **General**: Casual community hangouts and translation announcements.
- **Dynamic Sorting**: Filter threads by **Hot** (weighted activity), **Newest**, or **Top** (highest upvotes).
- **Interactive Engagements**: Upvote threads, share links, and participate in threaded replies with like reactions.
- **Pinned Announcements**: Highlight community guidelines and important updates.

### 🌐 3. Multi-Source Book API Integration
- **RanobeDB API Integration (`https://ranobedb.org/api/docs/v0`)**:
  - Live search across official Japanese and English light novel series and volumes.
  - Imports official high-resolution cover artwork, authors, volume counts, and complete synopses.
- **Open Library API**:
  - Live query millions of published novels, light novel adaptations, and web novels.
  - Open and rate-limit friendly book catalog for community discussions.
- **One-Click Discussion Linking**:
  - Search any light novel or book from inside the discussion modal.
  - Click **"Link"** to automatically import the novel into Noveland's MongoDB catalog and bind it to your post.

### 🔐 4. Authentication & Security
- **Email OTP Verification**: Secure 6-digit OTP email verification before account activation.
- **Dual-Token JWT Security**: Short-lived Access Tokens & long-lived Refresh Tokens stored in secure `httpOnly` cookies.
- **Password Management**: Bcrypt salted hashing, forgot password, and reset password via email tokens.
- **Protected Actions**: Public browsing for guests with protected posting, upvoting, and commenting.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/) (Modern Dark Glassmorphic Theme)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/) with credentials & interceptors
- **Notifications**: [React-Toastify](https://fkhadra.github.io/react-toastify/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express 5](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/) & [Bcrypt](https://www.npmjs.com/package/bcrypt)
- **Email Transporters**: [Nodemailer](https://nodemailer.com/) (Gmail SMTP & Mailtrap support)
- **Cookies & CORS**: `cookie-parser` & `cors` with credential support

---

## 📂 Project Structure

```text
Vanilla-Noveland/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── Database.config.js    # MongoDB Mongoose connection
│   │   │   └── Mail.config.js        # SMTP Mailer configuration
│   │   ├── controllers/
│   │   │   ├── Auth.controller.js    # Registration, OTP, Login, Password Reset
│   │   │   ├── Forum.controller.js   # Threads, Upvotes, Comments, Likes
│   │   │   ├── Novel.controller.js   # Catalog queries, Google & RanobeDB search
│   │   │   └── User.controller.js    # User profiles
│   │   ├── middlewares/
│   │   │   └── VerifyJWT.middleware.js # JWT verification & optional guest auth
│   │   ├── models/
│   │   │   ├── ForumComment.model.js # Threaded comments & likes schema
│   │   │   ├── ForumThread.model.js  # Forum discussions schema
│   │   │   ├── Novel.model.js        # Novel catalog schema
│   │   │   ├── RefreshToken.model.js # Stored refresh tokens
│   │   │   ├── User.model.js         # User credentials & verification
│   │   │   └── VerificationToken.model.js # OTP tokens
│   │   ├── routes/
│   │   │   ├── Auth.route.js
│   │   │   ├── Forum.route.js
│   │   │   ├── Novel.route.js
│   │   │   └── User.route.js
│   │   ├── services/
│   │   │   ├── Auth.service.js       # OTP generation, token signing & cookies
│   │   │   └── BookApi.service.js    # RanobeDB & Open Library search integrations
│   │   └── utils/
│   │       ├── mailTemplates.js      # Responsive HTML email templates
│   │       ├── response.js           # Standardized API response format
│   │       └── seedData.js           # Auto-seeder for sample novels & discussions
│   ├── server.js                     # Express app setup & route mounting
│   ├── package.json
│   └── .env                          # Backend environment variables
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── authApi.js            # Auth endpoints
│   │   │   ├── forumApi.js           # Forum endpoints
│   │   │   └── novelApi.js           # Novel & External search endpoints
│   │   ├── components/
│   │   │   ├── common/               # Shared inputs (OtpInput, etc.)
│   │   │   ├── forum/
│   │   │   │   └── CreateThreadModal.jsx # Discussion modal with live book search
│   │   │   └── Navbar.jsx            # Unified glassmorphic navbar
│   │   ├── config/
│   │   │   └── axios.js              # Axios instance with credentials
│   │   ├── pages/
│   │   │   ├── auth/                 # Login, Register, Verify OTP, Reset Password
│   │   │   ├── forum/
│   │   │   │   ├── ForumHubPage.jsx  # Main Forum with categories & sidebar
│   │   │   │   └── ThreadDetailPage.jsx # Thread reading view with comments
│   │   │   ├── novels/
│   │   │   │   └── NovelDetailPage.jsx  # Novel details & discussion tab
│   │   │   └── HomePage.jsx          # Discover feed & hot discussions
│   │   ├── routes/
│   │   │   └── AuthRoutes.jsx        # Auth sub-routes
│   │   ├── App.jsx                   # Main routes definition
│   │   └── main.jsx
│   ├── package.json
│   └── .env                          # Frontend environment variables
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (running locally or MongoDB Atlas URI)

---

### 1. Environment Setup

#### Backend (`backend/.env`)
Create or edit `backend/.env` with the following:

```env
# Server Port
PORT=3000

# JSON Web Tokens
ACCESS_TOKEN_SECRET=your_super_secret_access_token_key
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/noveland

# SMTP Email Configuration (Gmail or Mailtrap)
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_app_password
APP_NAME=Noveland
APP_GMAIL=noveland@gmail.com
APP_URL=http://localhost:5173
```

#### Frontend (`frontend/.env`)
Create or edit `frontend/.env`:

```env
VITE_SERVER_ENDPOINT=http://localhost:3000/api
```

---

### 2. Installation & Running

#### Start the Backend Server
```bash
cd backend
npm install
npm run dev
```
> **Note**: On startup, `server.js` automatically connects to MongoDB and initializes [`seedData.js`](backend/src/utils/seedData.js) with popular fantasy, action, and cultivation novels alongside active forum discussions if the database is empty.

#### Start the Frontend Application
```bash
cd frontend
npm install
npm run dev
```

Open your browser at **`http://localhost:5173`**.

---

## 📡 REST API Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new user & send verification OTP |
| `POST` | `/api/auth/verify` | Verify OTP code & activate account |
| `POST` | `/api/auth/send-otp` | Resend verification code |
| `POST` | `/api/auth/login` | Authenticate user & set JWT cookies |
| `POST` | `/api/auth/logout` | Clear session & remove cookies |
| `POST` | `/api/auth/forgot-password` | Send password reset email token |
| `POST` | `/api/auth/reset-password/:token` | Reset password using token |

### 📖 Novels (`/api/novels`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/novels` | List novels with search, category, and sorting |
| `GET` | `/api/novels/:id` | Get novel details and attached discussions |
| `GET` | `/api/novels/search/external?q=...&source=...` | Query RanobeDB & Open Library online |
| `POST` | `/api/novels/import-external` | Import book from search into catalog |

### 💬 Forum Discussions (`/api/forum`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/forum/threads` | Fetch threads (filters: category, novel, sort: hot/new/top) |
| `GET` | `/api/forum/threads/:id` | View thread detail (increments views) |
| `POST` | `/api/forum/threads` | Create new discussion (Auth required) |
| `POST` | `/api/forum/threads/:id/upvote` | Toggle thread upvote (Auth required) |
| `GET` | `/api/forum/threads/:id/comments` | Get threaded comments |
| `POST` | `/api/forum/threads/:id/comments` | Add comment or reply (Auth required) |
| `POST` | `/api/forum/comments/:id/like` | Toggle comment like (Auth required) |

---

## 📄 License
This project is open source and available under the [ISC License](LICENSE).
Novels and metadata retrieved from external APIs belong to their respective copyright holders and publishers.