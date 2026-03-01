import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignUp() {
  const { register } = useAuth();
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
    if (formData.password !== formData.confirm) return setError('Passwords do not match');
    if (formData.password.length < 6) return setError('Password must be at least 6 characters');

    setIsLoading(true);
    try {
      const result = await register(formData.name, formData.email, formData.password);
      if (result.success) navigate('/login', { state: { registered: true } });
    } catch (err) {
      setError(err.message || 'Registration failed');
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
          <h1 className="text-2xl font-bold text-[#25324B] mt-6 mb-2">Create an account</h1>
          <p className="text-[#515B6F] text-sm">Join thousands of job seekers today</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { label: 'Full Name', name: 'name', type: 'text', placeholder: 'Enter your full name' },
              { label: 'Email Address', name: 'email', type: 'email', placeholder: 'Enter your email' },
              { label: 'Password', name: 'password', type: 'password', placeholder: 'Min. 6 characters' },
              { label: 'Confirm Password', name: 'confirm', type: 'password', placeholder: 'Re-enter your password' },
            ].map(({ label, name, type, placeholder }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-[#25324B] mb-1.5">{label}</label>
                <input
                  type={type} name={name} value={formData[name]}
                  onChange={handleChange} required placeholder={placeholder}
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm text-sm text-[#25324B] placeholder-gray-400 focus:outline-none focus:border-[#4640DE] transition-colors"
                />
              </div>
            ))}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-sm px-4 py-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button type="submit" disabled={isLoading}
              className="w-full bg-[#4640DE] text-white py-3 rounded-sm text-sm font-semibold hover:bg-[#3730A3] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-[#515B6F] mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#4640DE] font-semibold hover:underline">Login</Link>
          </p>
        </div>

        <p className="text-center text-sm text-[#515B6F] mt-6">
          <Link to="/" className="hover:text-[#4640DE]">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}