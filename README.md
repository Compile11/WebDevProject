# WebDevProject

The Backend (/backend)
The backend is a RESTful API built with Express and MongoDB, handling authentication, data storage, and AI moderation.
backend/
├── middleware/       # Gatekeepers for routes (e.g., JWT Auth, Cloudinary/Multer image uploads)
├── models/           # MongoDB schemas (User.js, Post.js, Comment.js)
├── routes/           # API route definitions
│   ├── auth.js       # Login, registration, and password resets
│   ├── users.js      # Profile fetching and updating
│   └── comment.js    # Comment creation and AI toxicity checking
├── utils/            # Helper scripts (e.g., Perspective API moderator logic)
└── server.js         # The main entry point and Express configuration

The Frontend
The frontend is a modern, responsive single-page application built with React, Vite, and Tailwind CSS.
frontend/
├── src/
│   ├── api/          # Axios interceptors and functions to communicate with the backend
│   │
│   ├── components/   # Reusable UI elements
│   │   ├── auth/     # Login, Signup, and Forgot Password forms
│   │   ├── layout/   # Left and Right sidebars for the grid layout
│   │   ├── navigation/# Top Navbar and Account Dropdown logic
│   │   └── ui/       # Utility components like the Dark Mode ThemeToggle
│   │
│   ├── context/      # React Context providers (AuthContext.jsx for global user state)
│   │
│   ├── pages/        # Top-level page views (tied to React Router)
│   │   ├── HomePage.jsx          # The main 3-column feed
│   │   ├── PostDetailPage.jsx    # Expanded view for reading a single post and comments
│   │   ├── ProfilePage.jsx       # The current user's private settings/profile
│   │   └── PublicProfilePage.jsx # Public-facing view of other users
│   │
│   ├── utils/        # Helper functions (e.g., timestamp formatting)
│   │
│   ├── App.jsx       # Main application router and layout wrapper
│   └── main.jsx      # React DOM rendering entry point
