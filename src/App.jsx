import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { JobProvider } from './context/JobContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import JobDetail from './pages/JobDetail';
import Admin from './pages/Admin';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

// Protect admin route
function AdminRoute() {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  return <Admin />;
}

function Layout() {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);
  const isAdmin = location.pathname === '/admin';
  const hideShell = isAuthPage || isAdmin;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {!hideShell && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/job/:id" element={<JobDetail />} />
          <Route path="/admin" element={<AdminRoute />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </main>
      {!hideShell && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <JobProvider>
        <Router>
          <Layout />
        </Router>
      </JobProvider>
    </AuthProvider>
  );
}

export default App;