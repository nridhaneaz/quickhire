import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function AdminLogin() {
  const { admin, login } = useAdminAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (admin && admin.role === 'admin') {
      navigate('/admin', { replace: true });
    }
  }, [admin, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(formData.email, formData.password);
      // Use window.location for full page reload to ensure session restoration
      window.location.href = '/admin';
    } catch (err) {
      setError(err.message || 'Invalid email or password');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#25324B] flex items-center justify-center px-4">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#4640DE] opacity-10 rounded-full" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#4640DE] opacity-10 rounded-full" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-[#4640DE] rounded-full flex items-center justify-center shadow-lg shadow-[#4640DE]/30">
              <span className="text-white font-bold text-base">Q</span>
            </div>
            <span className="text-2xl font-bold text-white">QuickHire</span>
          </Link>

          {/* Admin badge */}
          <div className="mt-5 inline-flex items-center gap-2 bg-[#4640DE]/20 border border-[#4640DE]/40 text-[#A9A4F5] text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A9A4F5] inline-block" />
            Admin Portal
          </div>

          <h1 className="text-2xl font-bold text-white mt-4 mb-1">Administrator Login</h1>
          <p className="text-[#96A0B0] text-sm">Restricted access — authorised personnel only</p>
        </div>

        {/* Card */}
        <div className="bg-[#1E2A3A] border border-[#2E3E53] rounded-xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#C8D0DB] mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="admin@company.com"
                className="w-full px-4 py-3 bg-[#25324B] border border-[#2E3E53] rounded-lg text-sm text-white placeholder-[#4A5568] focus:outline-none focus:border-[#4640DE] focus:ring-1 focus:ring-[#4640DE] transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#C8D0DB] mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter admin password"
                className="w-full px-4 py-3 bg-[#25324B] border border-[#2E3E53] rounded-lg text-sm text-white placeholder-[#4A5568] focus:outline-none focus:border-[#4640DE] focus:ring-1 focus:ring-[#4640DE] transition-colors"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-900/30 border border-red-500/40 rounded-lg px-4 py-3 flex items-start gap-2">
                <svg className="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-11a.75.75 0 011.5 0v4a.75.75 0 01-1.5 0V7zm.75 7a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#4640DE] text-white py-3 rounded-lg text-sm font-semibold hover:bg-[#3730A3] transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-[#4640DE]/20 mt-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Authenticating...
                </span>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#2E3E53]" />
            <span className="text-[#4A5568] text-xs">or</span>
            <div className="flex-1 h-px bg-[#2E3E53]" />
          </div>

          <p className="text-center text-sm text-[#6B7A8D]">
            Not an admin?{' '}
            <Link to="/login" className="text-[#7975E3] hover:text-[#A9A4F5] font-medium transition-colors">
              Go to User Login →
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[#4A5568] mt-6">
          <Link to="/" className="hover:text-[#96A0B0] transition-colors">
            ← Back to QuickHire
          </Link>
        </p>
      </div>
    </div>
  );
}
