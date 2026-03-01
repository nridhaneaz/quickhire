# QuickHire - Frontend

A modern job portal application built with React, Vite, and Tailwind CSS. This application connects job seekers with employers through an intuitive interface with separate user and admin dashboards.

---

## 🎯 What is QuickHire?

QuickHire is a complete job portal solution where:
- **Job Seekers** can browse jobs, filter by categories/locations, and apply with their resumes
- **Admins** can manage jobs, categories, applications, users, and send broadcast emails to subscribers
- **Everyone** experiences a smooth, responsive interface with real-time notifications

---

## 🚀 Project Setup (Step-by-Step)

### Step 1: Prerequisites

Make sure you have these installed on your computer:
- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- A code editor like **VS Code**

### Step 2: Clone & Install

```bash
# Clone the repository
git clone https://github.com/yourusername/quickhire.git

# Navigate to project folder
cd quickhire

# Install all dependencies
npm install
```

This will install:
- React 19.2.0 - For building the UI
- Vite 7.3.1 - Fast development server
- Tailwind CSS 4.2.1 - For styling
- React Router DOM 7.13.1 - For navigation
- And other required packages

### Step 3: Environment Setup

Create a `.env` file in the root folder:

```env
VITE_API_URL=https://your-backend-api-url.com/api/v1
```

**What does this do?**
- Connects your frontend to the backend API
- Default URL is already set in code if you don't provide one

### Step 4: Run the Project

```bash
# Start development server
npm run dev
```

Your app will open at: `http://localhost:5173`

### Step 5: Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

The build files will be in the `dist/` folder.

---

## 📂 Understanding the Project Structure

```
quickhire/
│
├── src/
│   ├── components/          # Reusable UI pieces
│   │   ├── Navbar.jsx       # Top navigation bar
│   │   ├── Hero.jsx         # Homepage hero section
│   │   ├── JobCard.jsx      # Single job display card
│   │   ├── Categories.jsx   # Job categories section
│   │   └── Footer.jsx       # Bottom footer
│   │
│   ├── pages/               # Full page components
│   │   ├── Home.jsx         # Landing page
│   │   ├── AllJobs.jsx      # Jobs listing page
│   │   ├── JobDetail.jsx    # Individual job details
│   │   ├── Login.jsx        # User login page
│   │   ├── SignUp.jsx       # User registration page
│   │   ├── Profile.jsx      # User profile & applications
│   │   ├── AdminLogin.jsx   # Admin login page
│   │   └── Admin.jsx        # Admin dashboard (big file!)
│   │
│   ├── context/             # Global state management
│   │   ├── AuthContext.jsx       # User authentication state
│   │   ├── AdminAuthContext.jsx  # Admin authentication state
│   │   ├── JobContext.jsx        # Jobs & categories data
│   │   └── ToastContext.jsx      # Notification system
│   │
│   ├── lib/
│   │   └── api.js           # API calls & authentication handling
│   │
│   ├── App.jsx              # Main app component with routes
│   └── main.jsx             # Application entry point
│
├── public/                  # Static files (images, etc.)
├── .env                     # Environment variables
├── vite.config.js          # Vite configuration
└── package.json            # Dependencies & scripts
```

### Key Files Explained:

**`src/main.jsx`**
- Entry point of the application
- Renders the React app into the DOM

**`src/App.jsx`**
- Defines all routes (URLs)
- Wraps app with Context Providers
- Examples: `/` → Home, `/jobs` → All Jobs, `/admin` → Admin Panel

**`src/lib/api.js`**
- Handles all API communication
- Manages JWT tokens (login tokens)
- Auto-refreshes expired tokens
- Separate handling for user and admin requests

**Context Files**
- Store global data accessible throughout the app
- Example: User login info, jobs data, notifications

---

## 🔑 How Authentication Works

### For Regular Users:
1. User clicks "Login" and enters email/password
2. Backend returns access token + refresh token
3. Tokens saved in `sessionStorage`
4. Every API request includes the access token
5. When token expires, automatically refreshed
6. User can apply to jobs, view profile, track applications

### For Admins:
1. Admin goes to `/admin/login`
2. Separate authentication with session storage
3. Access to admin dashboard at `/admin`
4. Can manage everything: jobs, categories, applications, users
5. Session expires after 30 minutes of inactivity

### Token Management (Automatic):
```javascript
// When you make an API call
api('/jobs')

// Behind the scenes:
// 1. Adds your token to request
// 2. If token expired (401 error)
// 3. Automatically gets new token
// 4. Retries the request
// 5. You never notice it happened!
```

---

## 🎨 Features Breakdown

### 1. **Homepage** (`/`)
Shows:
- Hero section with search
- Featured job categories
- Latest job listings
- Call-to-action banners
- Newsletter subscription

### 2. **Jobs Page** (`/jobs`)
- Browse all available jobs
- Filter by category
- Filter by location
- Filter by job type (Full-time, Part-time, etc.)
- Search functionality

### 3. **Job Details** (`/job/:id`)
- Complete job information
- Company details
- Requirements & responsibilities
- Apply button (requires login)
- Toast notification if not logged in

### 4. **User Profile** (`/profile`)
- View personal information
- See all applications
- Track application status
- Update profile (if implemented)

### 5. **Admin Dashboard** (`/admin`)
Four main tabs:

**Jobs Tab:**
- Create new jobs with company logo
- Edit existing jobs
- Delete jobs
- Toggle job status (Active/Inactive)
- View all jobs in a table

**Categories Tab:**
- Add new categories with images
- Edit category names and images
- Delete categories
- Toggle category status

**Applications Tab:**
- View all job applications
- Filter by status (Pending, Reviewed, Accepted, Rejected)
- Update application status
- Delete applications
- View detailed application info

**Subscribers Tab:**
- View newsletter subscribers
- Send broadcast emails to all
- Send emails to specific subscriber
- Delete subscribers
- View broadcast history

---

## 💡 Understanding Key Concepts

### React Context (Global State)

Think of Context like a "global storage box" that any component can access:

```javascript
// Instead of passing data through props like this:
<Parent data={data}>
  <Child data={data}>
    <GrandChild data={data} />
  </Child>
</Parent>

// Use Context:
<ContextProvider value={data}>
  <Parent>
    <Child>
      <GrandChild /> // Can access data directly!
    </Child>
  </Parent>
</ContextProvider>
```

### State Management in QuickHire:

**AuthContext** - Stores:
- Current user info
- `login()` function
- `logout()` function
- `loading` state

**JobContext** - Stores:
- All jobs array
- Categories array
- Functions to add/edit/delete jobs
- Functions to manage categories

**ToastContext** - Stores:
- `addToast()` function to show notifications
- Array of active toasts
- Auto-dismisses after 3 seconds

### React Router (Navigation)

Controls what shows on each URL:

```javascript
// User visits "/" → Shows Home page
<Route path="/" element={<Home />} />

// User visits "/jobs" → Shows All Jobs page
<Route path="/jobs" element={<AllJobs />} />

// User visits "/job/123" → Shows that specific job
<Route path="/job/:id" element={<JobDetail />} />

// Admin visits "/admin" → Protected route, checks if admin
<Route path="/admin" element={<AdminRoute />} />
```

---

## 🛠️ Development Tips

### Running the Project:

```bash
# Development mode (hot reload)
npm run dev

# Build for production
npm run build

# Check for code issues
npm run lint
```

### Common Commands:

```bash
# Install a new package
npm install package-name

# Update dependencies
npm update

# Clear cache if needed
npm cache clean --force
rm -rf node_modules
npm install
```

### Adding New Features:

1. **New Page:**
   - Create file in `src/pages/MyNewPage.jsx`
   - Add route in `src/App.jsx`
   - Add navigation link in `src/components/Navbar.jsx`

2. **New Component:**
   - Create file in `src/components/MyComponent.jsx`
   - Import and use in any page

3. **New API Call:**
   - Add function in `src/lib/api.js`
   - Use in your component with async/await

---

## 🚨 Common Issues & Solutions

### Issue: Port already in use
```bash
# Kill the process on port 5173
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5173 | xargs kill
```

### Issue: Module not found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: Environment variables not working
- Make sure `.env` file is in root directory
- Variable names must start with `VITE_`
- Restart dev server after changes
- Access with `import.meta.env.VITE_API_URL`

### Issue: Toast notifications not showing
- Check `ToastProvider` wraps your app in `App.jsx`
- Make sure you import `useToast` hook
- Call `addToast('message', 'success')` properly

---

## 📦 Dependencies Explained

### Production Dependencies:
```json
"react": "^19.2.0"              // Core UI library
"react-dom": "^19.2.0"          // React DOM rendering
"react-router-dom": "^7.13.1"   // Client-side routing
```

### Development Dependencies:
```json
"vite": "^7.3.1"                 // Build tool & dev server (super fast!)
"tailwindcss": "^4.2.1"          // CSS framework
"eslint": "^9.39.1"              // Code quality checker
"@vitejs/plugin-react": "^5.1.1" // React support for Vite
```

---

## 🎓 Learning Resources

If you're new to any of these technologies:

- **React:** https://react.dev/learn
- **Vite:** https://vitejs.dev/guide/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **React Router:** https://reactrouter.com/en/main

---

## 📞 Need Help?

- Check existing code for examples
- Look at console for error messages
- Read error carefully - they usually tell you what's wrong
- Use browser DevTools (F12) to debug

---

Made with ❤️ for learning and building awesome projects!
