import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Show admin link only when ?admin is present in the URL
  const showAdminLink = new URLSearchParams(location.search).has('admin');

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo — clicking refreshes the page */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#4640DE] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">Q</span>
            </div>
            <span className="text-xl font-bold text-[#25324B]">QuickHire</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/jobs" className="text-sm font-medium text-[#515B6F] hover:text-[#4640DE]">
              Find Jobs
            </Link>
            <Link to="/categories" className="text-sm font-medium text-[#515B6F] hover:text-[#4640DE]">
              Browse Categories
            </Link>

            <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
              {user ? (
                // Logged in state
                <div className="flex items-center gap-3">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    <div className="w-8 h-8 bg-[#4640DE] rounded-full flex items-center justify-center overflow-hidden shrink-0">
                      {user?.profileImage
                        ? <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                        : <span className="text-white text-xs font-bold uppercase">{user?.name?.charAt(0) || 'Q'}</span>
                      }
                    </div>
                    <span className="text-sm font-medium text-[#25324B] capitalize">{user?.name || 'User'}</span>
                  </Link>
                  <Link to="/profile" className="text-xs text-[#4640DE] font-medium hover:underline">
                    My Applications
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-[#515B6F] hover:text-red-500 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                // Logged out state
                <>
                  <Link
                    to="/login"
                    className="text-[#4640DE] font-semibold text-sm hover:text-[#3730A3]"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-[#4640DE] text-white px-5 py-2.5 rounded-sm text-sm font-semibold hover:bg-[#3730A3] transition-colors"
                  >
                    Sign Up
                  </Link>
                  {showAdminLink && (
                    <Link
                      to="/admin/login"
                      className="flex items-center gap-1.5 text-xs font-medium text-[#515B6F] border border-gray-200 px-3 py-2 rounded-sm hover:border-[#4640DE] hover:text-[#4640DE] transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Admin
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg className="w-6 h-6 text-[#25324B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-4">
              <Link to="/jobs" className="text-sm font-medium text-[#515B6F] hover:text-[#4640DE]" onClick={() => setIsMenuOpen(false)}>
                Find Jobs
              </Link>
              <Link to="/categories" className="text-sm font-medium text-[#515B6F] hover:text-[#4640DE]" onClick={() => setIsMenuOpen(false)}>
                Browse Categories
              </Link>
              <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                {user ? (
                  <>
                    <Link to="/profile" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                      <div className="w-8 h-8 bg-[#4640DE] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold uppercase">{user?.name?.charAt(0) || 'Q'}</span>
                      </div>
                      <span className="text-sm font-medium text-[#25324B] capitalize">{user?.name || 'User'}</span>
                    </Link>
                    <Link to="/profile" className="text-sm text-[#4640DE] font-medium" onClick={() => setIsMenuOpen(false)}>
                      My Applications
                    </Link>
                    <button onClick={handleLogout} className="text-sm text-red-500 text-left font-medium">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="text-[#4640DE] font-semibold text-sm" onClick={() => setIsMenuOpen(false)}>
                      Login
                    </Link>
                    <Link to="/signup" className="bg-[#4640DE] text-white px-5 py-2.5 rounded-sm text-sm font-semibold text-center" onClick={() => setIsMenuOpen(false)}>
                      Sign Up
                    </Link>
                    {showAdminLink && (
                      <Link to="/admin/login" className="text-xs font-medium text-[#515B6F] hover:text-[#4640DE]" onClick={() => setIsMenuOpen(false)}>
                        Admin Portal
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}