# Nairobi Electronics - E-Commerce Platform

A modern full-stack e-commerce platform built with React, Express.js, and PostgreSQL. Features a complete shopping experience with user authentication, product catalog, shopping cart, admin dashboard, and email notifications.

## 🚀 Live Demo

- **GitHub Repository**: https://github.com/MagetoJ/nairobi-electronic.git
- **Vercel Deployment**: Ready for deployment
- **Netlify Deployment**: Ready for deployment

## ✨ Features

- **🛒 E-Commerce Core**
  - Product catalog with categories and search
  - Shopping cart with persistent storage
  - User authentication and profiles
  - Order management system
  - Cash on Delivery payment method

- **👥 User Management**
  - User registration and login
  - Profile management
  - Order history
  - Admin dashboard

- **🔧 Admin Features**
  - Product management (CRUD operations)
  - Order management and tracking
  - User management
  - Analytics dashboard

- **📱 Modern UI/UX**
  - Responsive design with Tailwind CSS
  - Modern components with Radix UI
  - Dark/Light mode support
  - Progressive Web App (PWA) capabilities

- **⚡ Performance & SEO**
  - Server-side rendering
  - SEO optimized with meta tags
  - Structured data for search engines
  - Image optimization
  - Service worker for offline support

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Wouter** - Lightweight routing
- **TanStack Query** - Data fetching and caching
- **Framer Motion** - Smooth animations

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe backend development
- **Drizzle ORM** - Type-safe database queries
- **PostgreSQL** - Primary database (Neon)
- **Passport.js** - Authentication middleware
- **Nodemailer** - Email service

### Deployment & Tools
- **Vite** - Fast build tool and dev server
- **ESBuild** - Fast JavaScript bundler
- **Playwright** - E2E testing framework
- **Vercel** - Deployment platform
- **Netlify** - Alternative deployment
- **GitHub Actions** - CI/CD pipeline

## 🚀 Deployment

### Vercel Deployment

1. **Fork/Import Repository**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import from GitHub: `https://github.com/MagetoJ/nairobi-electronic.git`

2. **Environment Variables**:
   Set these environment variables in Vercel:
   ```
   NODE_ENV=production
   DATABASE_URL=your_neon_postgresql_url
   SESSION_SECRET=your_secure_session_secret
   EMAIL_USER=your_gmail_email
   EMAIL_PASSWORD=your_gmail_app_password
   ```

3. **Deploy**:
   - Vercel will automatically detect the configuration from `vercel.json`
   - Build command: `npm run build`
   - Output directory: `dist/public`

### Netlify Deployment

1. **Connect Repository**:
   - Go to [Netlify Dashboard](https://netlify.com/dashboard)
   - Click "New Site from Git"
   - Connect GitHub repository: `https://github.com/MagetoJ/nairobi-electronic.git`

2. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist/public`
   - Node version: `20`

3. **Environment Variables**:
   Set the same environment variables as Vercel in Netlify's site settings.

4. **Deploy**:
   - Netlify will use the configuration from `netlify.toml`
   - Functions will be deployed to `/.netlify/functions/`

## 🏗️ Local Development

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (or use Neon)
- Git

### Setup

1. **Clone Repository**:
   ```bash
   git clone https://github.com/MagetoJ/nairobi-electronic.git
   cd nairobi-electronic
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create `.env` file:
   ```env
   NODE_ENV=development
   PORT=5000
   DATABASE_URL=your_postgresql_connection_string
   SESSION_SECRET=your_session_secret
   EMAIL_USER=your_gmail_email
   EMAIL_PASSWORD=your_gmail_app_password
   REPLIT_ID=your_domain
   ```

4. **Database Setup**:
   ```bash
   npm run db:push
   ```

5. **Start Development Server**:
   ```bash
   npm run dev
   ```

6. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

## 🧪 Testing

Run the test suite:
```bash
# Install Playwright browsers
npx playwright install

# Run E2E tests
npx playwright test

# Run tests with UI
npx playwright test --ui
```

## 📝 Environment Variables

### Required Variables
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Secret key for session encryption

### Optional Variables
- `EMAIL_USER` - Gmail address for notifications
- `EMAIL_PASSWORD` - Gmail app password
- `REPLIT_ID` - Domain for authentication
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 5000)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Support

For support and questions:
- Email: jabezmageto78@gmail.com
- GitHub Issues: [Create an issue](https://github.com/MagetoJ/nairobi-electronic/issues)

---

**Made with ❤️ in Kenya** 🇰🇪