import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { JobProvider } from './context/JobContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import JobDetail from './pages/JobDetail';
import AllJobs from './pages/AllJobs';
import AllCategories from './pages/AllCategories';
import Admin from './pages/Admin';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';

// Protect admin route — uses the SEPARATE admin session
function AdminRoute() {
  const { admin } = useAdminAuth();
  if (!admin || admin.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }
  return <Admin />;
}

function Layout() {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup', '/admin/login', '/forgot-password'].includes(location.pathname);
  const isAdmin = location.pathname === '/admin';
  const isProfile = location.pathname === '/profile';
  const hideShell = isAuthPage || isAdmin || isProfile;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {!hideShell && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<AllJobs />} />
          <Route path="/categories" element={<AllCategories />} />
          <Route path="/job/:id" element={<JobDetail />} />
          <Route path="/admin" element={<AdminRoute />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </main>
      {!hideShell && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <AdminAuthProvider>
        <AuthProvider>
          <JobProvider>
            <Router>
              <Layout />
            </Router>
          </JobProvider>
        </AuthProvider>
      </AdminAuthProvider>
    </ToastProvider>
  );
}

export default App;