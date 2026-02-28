import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#4640DE] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">Q</span>
            </div>
            <span className="text-xl font-bold text-[#25324B]">QuickHire</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#find-jobs" className="text-sm font-medium text-[#515B6F] hover:text-[#4640DE]">
              Find Jobs
            </a>
            <a href="#browse-companies" className="text-sm font-medium text-[#515B6F] hover:text-[#4640DE]">
              Browse Companies
            </a>

            <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
              {user ? (
                // Logged in state
                <div className="flex items-center gap-3">
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="text-sm font-medium text-[#515B6F] hover:text-[#4640DE]"
                    >
                      Dashboard
                    </Link>
                  )}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#4640DE] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold uppercase">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-[#25324B] capitalize">{user.name}</span>
                  </div>
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
              <a href="#find-jobs" className="text-sm font-medium text-[#515B6F] hover:text-[#4640DE]" onClick={() => setIsMenuOpen(false)}>
                Find Jobs
              </a>
              <a href="#browse-companies" className="text-sm font-medium text-[#515B6F] hover:text-[#4640DE]" onClick={() => setIsMenuOpen(false)}>
                Browse Companies
              </a>
              <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                {user ? (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#4640DE] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold uppercase">{user.name.charAt(0)}</span>
                      </div>
                      <span className="text-sm font-medium text-[#25324B] capitalize">{user.name}</span>
                    </div>
                    {user.role === 'admin' && (
                      <Link to="/admin" className="text-sm font-medium text-[#4640DE]" onClick={() => setIsMenuOpen(false)}>
                        Admin Dashboard
                      </Link>
                    )}
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