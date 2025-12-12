# Team Registration Platform 🚀

A modern, full-stack web platform for team registration with human verification, ID card upload, and automated email confirmation.

![Platform Preview](https://via.placeholder.com/800x400?text=Team+Registration+Platform)

## ✨ Features

- **Modern UI/UX** - Beautiful, responsive design with smooth animations using React, Tailwind CSS, and Framer Motion
- **Multi-Step Registration** - Intuitive 4-step registration process
- **Human Verification** - reCAPTCHA v2 integration to prevent bot registrations
- **ID Card Upload** - Drag-and-drop file upload with preview and verification
- **Unique Team ID** - Auto-generated unique identifier for each team (TEAM-XXXX-XXXX format)
- **Email Confirmation** - Automated, beautifully designed confirmation emails
- **TypeScript** - Full type safety across frontend and backend

## 🛠️ Tech Stack

### Frontend

- React 18 with TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Framer Motion (animations)
- React Hot Toast (notifications)
- Lucide React (icons)
- React Google reCAPTCHA

### Backend

- Node.js with Express
- TypeScript
- Multer (file uploads)
- Nodemailer (email sending)
- UUID (ID generation)

## 📁 Project Structure

```
team-registration-platform/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── api/             # API service functions
│   │   ├── components/      # React components
│   │   ├── types/           # TypeScript types
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Entry point
│   ├── package.json
│   └── vite.config.ts
├── backend/                  # Express backend
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic (email)
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Helper functions
│   │   └── server.ts        # Express server
│   ├── uploads/             # Uploaded ID cards
│   ├── package.json
│   └── .env
├── package.json              # Root package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone and navigate to the project:**

   ```bash
   cd team-registration-platform
   ```

2. **Install all dependencies:**

   ```bash
   npm run install:all
   ```

   Or install separately:

   ```bash
   # Root dependencies
   npm install

   # Frontend dependencies
   cd frontend && npm install && cd ..

   # Backend dependencies
   cd backend && npm install && cd ..
   ```

3. **Start development servers:**

   ```bash
   npm run dev
   ```

   This starts both:

   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

### Individual Commands

```bash
# Start frontend only
npm run dev:frontend

# Start backend only
npm run dev:backend

# Build frontend for production
npm run build
```

## ⚙️ Configuration

### reCAPTCHA Setup

The project uses Google's test keys by default (always pass verification). For production:

1. Get your reCAPTCHA v2 keys from [Google reCAPTCHA](https://www.google.com/recaptcha/admin)

2. Update frontend (`frontend/src/components/RegistrationForm.tsx`):

   ```typescript
   const RECAPTCHA_SITE_KEY = "your-site-key";
   ```

3. Update backend (`backend/.env`):
   ```env
   RECAPTCHA_SECRET_KEY=your-secret-key
   ```

### Email Configuration

By default, the backend uses [Ethereal](https://ethereal.email) for testing emails. Ethereal credentials are auto-generated on first run.

For production with Gmail:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
```

> **Note:** For Gmail, you need to create an [App Password](https://support.google.com/accounts/answer/185833)

## 📧 Testing Emails

When using Ethereal (default):

1. Start the backend server
2. Complete a registration
3. Check the console for the Ethereal preview URL
4. Or visit [Ethereal](https://ethereal.email) and login with the generated credentials

## 🔐 API Endpoints

| Method | Endpoint                | Description            |
| ------ | ----------------------- | ---------------------- |
| POST   | `/api/register`         | Register a new team    |
| POST   | `/api/verify-recaptcha` | Verify reCAPTCHA token |
| GET    | `/api/team/:teamId`     | Get team by ID         |
| GET    | `/api/health`           | Health check           |

### Register Team Request

```bash
curl -X POST http://localhost:5000/api/register \
  -F "teamName=Awesome Team" \
  -F "teamLeaderName=John Doe" \
  -F "teamLeaderEmail=john@example.com" \
  -F "teamMembers=[{\"name\":\"Jane\",\"email\":\"jane@example.com\",\"role\":\"Developer\"}]" \
  -F "recaptchaToken=your-token" \
  -F "idCard=@/path/to/id-card.jpg"
```

## 🎨 UI Components

- **Header** - Responsive navigation with logo and status indicator
- **HeroSection** - Animated landing page with feature highlights
- **RegistrationForm** - Multi-step form with progress indicator
- **TeamMemberInput** - Dynamic team member management
- **FileUpload** - Drag-and-drop with preview and verification
- **SuccessPage** - Confirmation with team ID card display
- **Footer** - Links and social media icons

## 🔒 Security Features

- reCAPTCHA v2 human verification
- File type validation (JPEG, PNG, WebP, PDF only)
- File size limits (10MB max)
- Input sanitization
- CORS configuration

## 📱 Responsive Design

The platform is fully responsive and works on:

- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🚀 Production Deployment

### Frontend (Vercel/Netlify)

1. Build the frontend:

   ```bash
   cd frontend && npm run build
   ```

2. Deploy the `dist` folder to your hosting provider

3. Set environment variable for API URL if different from `/api`

### Backend (Railway/Render/DigitalOcean)

1. Set environment variables:

   ```env
   NODE_ENV=production
   PORT=5000
   RECAPTCHA_SECRET_KEY=your-production-key
   SMTP_HOST=your-smtp-host
   SMTP_USER=your-smtp-user
   SMTP_PASS=your-smtp-pass
   SMTP_FROM=your-from-email
   FRONTEND_URL=https://your-frontend-url.com
   ```

2. Build and start:
   ```bash
   cd backend
   npm run build
   npm start
   ```

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using React, Express, and TypeScript
