import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignUp() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const result = login(formData.email, formData.password);
    setIsLoading(false);
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8fd] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-[#4640DE] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-base">Q</span>
            </div>
            <span className="text-2xl font-bold text-[#25324B]">QuickHire</span>
          </Link>
          <h1 className="text-2xl font-bold text-[#25324B] mt-6 mb-2">Create an account</h1>
          <p className="text-[#515B6F] text-sm">Join thousands of job seekers today</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#25324B] mb-1.5">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-200 rounded-sm text-sm text-[#25324B] placeholder-gray-400 focus:outline-none focus:border-[#4640DE] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#25324B] mb-1.5">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-200 rounded-sm text-sm text-[#25324B] placeholder-gray-400 focus:outline-none focus:border-[#4640DE] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#25324B] mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Min. 6 characters"
                className="w-full px-4 py-3 border border-gray-200 rounded-sm text-sm text-[#25324B] placeholder-gray-400 focus:outline-none focus:border-[#4640DE] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#25324B] mb-1.5">Confirm Password</label>
              <input
                type="password"
                name="confirm"
                value={formData.confirm}
                onChange={handleChange}
                required
                placeholder="Re-enter your password"
                className="w-full px-4 py-3 border border-gray-200 rounded-sm text-sm text-[#25324B] placeholder-gray-400 focus:outline-none focus:border-[#4640DE] transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-sm px-4 py-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#4640DE] text-white py-3 rounded-sm text-sm font-semibold hover:bg-[#3730A3] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-[#515B6F] mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#4640DE] font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>

        <p className="text-center text-sm text-[#515B6F] mt-6">
          <Link to="/" className="hover:text-[#4640DE]">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}