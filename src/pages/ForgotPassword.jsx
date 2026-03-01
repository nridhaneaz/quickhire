import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../lib/api';

// Step indicators
const STEPS = ['Email', 'Verify Code', 'New Password'];

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 | 2 | 3 | 4 (success)

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ── Step 1: send OTP ─────────────────────────────────────────
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authAPI.forgetPassword(email);
      setStep(2);
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: verify OTP ───────────────────────────────────────
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (otp.length !== 6) { setError('Please enter the 6-digit code.'); return; }
    setLoading(true);
    try {
      await authAPI.verifyCode(email, otp);
      setStep(3);
    } catch (err) {
      setError(err.message || 'Invalid or expired code.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: reset password ───────────────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      await authAPI.resetPassword(email, newPassword);
      setStep(4);
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
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
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">

          {/* ── Success ── */}
          {step === 4 ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[#25324B] mb-2">Password Reset!</h2>
              <p className="text-[#515B6F] text-sm mb-6">Your password has been changed successfully.</p>
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-[#4640DE] text-white py-3 rounded-sm text-sm font-semibold hover:bg-[#3730A3] transition-colors"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <>
              {/* Step indicator */}
              <div className="flex items-center mb-8">
                {STEPS.map((label, i) => {
                  const num = i + 1;
                  const active = num === step;
                  const done = num < step;
                  return (
                    <div key={label} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                          ${done ? 'bg-green-500 text-white' : active ? 'bg-[#4640DE] text-white' : 'bg-gray-100 text-gray-400'}`}>
                          {done
                            ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                            : num}
                        </div>
                        <span className={`text-xs mt-1 font-medium whitespace-nowrap ${active ? 'text-[#4640DE]' : done ? 'text-green-500' : 'text-gray-400'}`}>
                          {label}
                        </span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-2 mb-4 ${done ? 'bg-green-400' : 'bg-gray-200'}`} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* ── Step 1: Email ── */}
              {step === 1 && (
                <form onSubmit={handleSendOtp} className="space-y-5">
                  <div>
                    <h2 className="text-xl font-bold text-[#25324B] mb-1">Forgot Password</h2>
                    <p className="text-sm text-[#515B6F]">Enter your email and we'll send a verification code.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#25324B] mb-1.5">Email Address</label>
                    <input
                      type="email" required value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 border border-gray-200 rounded-sm text-sm text-[#25324B] placeholder-gray-400 focus:outline-none focus:border-[#4640DE] transition-colors"
                    />
                  </div>
                  {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-sm px-4 py-3">{error}</p>}
                  <button type="submit" disabled={loading}
                    className="w-full bg-[#4640DE] text-white py-3 rounded-sm text-sm font-semibold hover:bg-[#3730A3] transition-colors disabled:opacity-60">
                    {loading ? 'Sending...' : 'Send Verification Code'}
                  </button>
                </form>
              )}

              {/* ── Step 2: OTP ── */}
              {step === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  <div>
                    <h2 className="text-xl font-bold text-[#25324B] mb-1">Enter Verification Code</h2>
                    <p className="text-sm text-[#515B6F]">
                      We sent a 6-digit code to <span className="font-medium text-[#25324B]">{email}</span>.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#25324B] mb-1.5">Verification Code</label>
                    <input
                      type="text" required value={otp} maxLength={6}
                      onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); setError(''); }}
                      placeholder="6-digit code"
                      className="w-full px-4 py-3 border border-gray-200 rounded-sm text-sm text-[#25324B] placeholder-gray-400 focus:outline-none focus:border-[#4640DE] transition-colors tracking-widest text-center text-lg font-bold"
                    />
                  </div>
                  {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-sm px-4 py-3">{error}</p>}
                  <button type="submit" disabled={loading}
                    className="w-full bg-[#4640DE] text-white py-3 rounded-sm text-sm font-semibold hover:bg-[#3730A3] transition-colors disabled:opacity-60">
                    {loading ? 'Verifying...' : 'Verify Code'}
                  </button>
                  <button type="button" onClick={() => { setStep(1); setOtp(''); setError(''); }}
                    className="w-full text-sm text-[#515B6F] hover:text-[#4640DE] transition-colors">
                    ← Change email
                  </button>
                </form>
              )}

              {/* ── Step 3: New Password ── */}
              {step === 3 && (
                <form onSubmit={handleResetPassword} className="space-y-5">
                  <div>
                    <h2 className="text-xl font-bold text-[#25324B] mb-1">Set New Password</h2>
                    <p className="text-sm text-[#515B6F]">Choose a strong password for your account.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#25324B] mb-1.5">New Password</label>
                    <input
                      type="password" required value={newPassword} minLength={6}
                      onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                      placeholder="Min. 6 characters"
                      className="w-full px-4 py-3 border border-gray-200 rounded-sm text-sm text-[#25324B] placeholder-gray-400 focus:outline-none focus:border-[#4640DE] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#25324B] mb-1.5">Confirm Password</label>
                    <input
                      type="password" required value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                      placeholder="Re-enter new password"
                      className="w-full px-4 py-3 border border-gray-200 rounded-sm text-sm text-[#25324B] placeholder-gray-400 focus:outline-none focus:border-[#4640DE] transition-colors"
                    />
                  </div>
                  {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-sm px-4 py-3">{error}</p>}
                  <button type="submit" disabled={loading}
                    className="w-full bg-[#4640DE] text-white py-3 rounded-sm text-sm font-semibold hover:bg-[#3730A3] transition-colors disabled:opacity-60">
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </form>
              )}
            </>
          )}
        </div>

        <p className="text-center text-sm text-[#515B6F] mt-6">
          Remember your password?{' '}
          <Link to="/login" className="text-[#4640DE] font-semibold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
