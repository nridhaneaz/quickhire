import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const justRegistered = location.state?.registered === true;
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isAdminError, setIsAdminError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setIsAdminError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setIsAdminError(false);
    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        if (result.role === 'admin') {
          setIsAdminError(true);
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8fd] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-[#4640DE] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-base">Q</span>
            </div>
            <span className="text-2xl font-bold text-[#25324B]">QuickHire</span>
          </Link>
          <h1 className="text-2xl font-bold text-[#25324B] mt-6 mb-2">Welcome back</h1>
          <p className="text-[#515B6F] text-sm">Login to your account to continue</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          {justRegistered && (
            <div className="mb-5 flex items-center gap-2 bg-green-50 border border-green-200 rounded-sm px-4 py-3">
              <svg className="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-green-700 text-sm font-medium">Account created! Please log in to continue.</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#25324B] mb-1.5">Email Address</label>
              <input
                type="email" name="email" value={formData.email}
                onChange={handleChange} required placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-200 rounded-sm text-sm text-[#25324B] placeholder-gray-400 focus:outline-none focus:border-[#4640DE] transition-colors"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-[#25324B]">Password</label>
                <Link to="/forgot-password" className="text-xs text-[#4640DE] hover:underline">Forgot password?</Link>
              </div>
              <input
                type="password" name="password" value={formData.password}
                onChange={handleChange} required placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-200 rounded-sm text-sm text-[#25324B] placeholder-gray-400 focus:outline-none focus:border-[#4640DE] transition-colors"
              />
            </div>

            {isAdminError && (
              <div className="bg-red-50 border border-red-200 rounded-sm px-4 py-3">
                <p className="text-red-600 text-sm">
                  Admin accounts must log in via the{' '}
                  <Link to="/admin/login" className="font-semibold underline hover:text-red-800">
                    Admin Portal
                  </Link>
                  .
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-sm px-4 py-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button type="submit" disabled={isLoading}
              className="w-full bg-[#4640DE] text-white py-3 rounded-sm text-sm font-semibold hover:bg-[#3730A3] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-sm text-[#515B6F] mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#4640DE] font-semibold hover:underline">Sign Up</Link>
          </p>
        </div>

        <p className="text-center text-sm text-[#515B6F] mt-6">
          <Link to="/" className="hover:text-[#4640DE]">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}