# Compile: An Ethics-First Community Platform

Compile is a high-performance, full-stack discussion forum engineered with an Anticipatory Ethical Framework. It utilizes real-time AI moderation to identify and block toxic content at the point of entry, ensuring a secure environment for community interaction.

## Key Features

### Proactive AI Moderation
* **Text Analysis:** Integration with the Perspective API to evaluate toxicity, insult, and threat levels. Submissions exceeding an 80% threshold are blocked before reaching the database.
* **Visual Gatekeeping:** Automated image moderation via Google Cloud Vision API, using SafeSearch detection to filter out non-compliant media.
* **Cloud Sanitization:** Automated Cloudinary lifecycle management that purges associated media assets upon post deletion to manage storage and privacy.

### Monetization and Management
* **Tiered Subscriptions:** Full Stripe API integration for recurring billing, subscription management, and secure customer portals.
* **Atomic Performance:** High-speed data handling using MongoDB's `$inc` operator for real-time comment and interaction counters, eliminating expensive aggregate queries.
* **Real-Time Presence:** A silent heartbeat system within the authentication middleware that tracks user activity and displays live staff presence.

### Security and Governance
* **RBAC Architecture:** Tiered Role-Based Access Control (Admin, Moderator, User) protecting sensitive moderation endpoints.
* **JWT Authentication:** Secure token-based sessions with hashed credential storage.

## Tech Stack

* **Frontend:** React.js, Tailwind CSS, Lucide-React, Axios
* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose ODM
* **APIs:** Google Cloud Vision, Perspective API, Stripe, Cloudinary

## Project Structure


├── backend/
│   ├── middleware/       # Auth, Admin, and Upload logic
│   ├── models/           # Mongoose schemas (User, Post, Comment)
│   ├── routes/           # API endpoints (Stripe, AI Moderation)
│   └── utils/            # Logic for toxicity scoring and image moderation
├── frontend/
│   ├── src/
│   │   ├── api/          # Axios client and endpoint definitions
│   │   ├── components/   # UI components (Feed, Sidebar, Moderation tools)
│   │   └── utils/        # Formatting and time helpers
└── .env                  # Configuration for API keys and database URIs


## Installation and Setup

1. **Clone the repository:**
   ```bash
   git clone [repository-url]
   ```

2. **Install dependencies:**
   ```bash
   # Backend
   cd backend && npm install

   # Frontend
   cd ../frontend && npm install
   
```

3. **Environment Variables:**
   Create a `.env` file in the `backend` directory with the following:
   ```env
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   STRIPE_SECRET_KEY=your_stripe_key
   CLOUDINARY_URL=your_cloudinary_url
   GOOGLE_APPLICATION_CREDENTIALS=path_to_json_key
   
```

4. **Run the application:**
  double click start.sh   
