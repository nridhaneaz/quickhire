import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { applicationsAPI, usersAPI } from '../lib/api';

const STATUS_COLORS = {
  PENDING:  'bg-yellow-100 text-yellow-700',
  REVIEWED: 'bg-blue-100 text-blue-700',
  ACCEPTED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
};

const STATUS_LABELS = {
  PENDING:  'Pending Review',
  REVIEWED: 'Under Review',
  ACCEPTED: 'Accepted',
  REJECTED: 'Not Selected',
};

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', phone: '', location: '' });
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState('');
  const avatarInputRef = useRef(null);

  const openEdit = () => {
    setEditForm({
      name: user.name || '',
      phone: user.phone || '',
      location: user.location || '',
    });
    setEditError('');
    setEditMode(true);
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) { setEditError('Name is required.'); return; }
    setEditSaving(true);
    setEditError('');
    try {
      const res = await usersAPI.updateProfile({
        name: editForm.name.trim(),
        phone: editForm.phone.trim(),
        location: editForm.location.trim(),
      });
      const updated = res?.data;
      updateUser({
        name: updated?.name || editForm.name.trim(),
        phone: updated?.phone || editForm.phone.trim(),
        location: updated?.location || editForm.location.trim(),
      });
      setEditMode(false);
    } catch (err) {
      setEditError(err.message || 'Failed to save. Please try again.');
    } finally {
      setEditSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('profileImage', file);
    setAvatarUploading(true);
    try {
      const res = user.profileImage
        ? await usersAPI.updateAvatar(formData)
        : await usersAPI.uploadAvatar(formData);
      const profileImage = res?.data?.profileImage || res?.data?.user?.profileImage;
      if (profileImage) updateUser({ profileImage });
    } catch (err) {
      console.error('Avatar upload failed:', err);
    } finally {
      setAvatarUploading(false);
      e.target.value = '';
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchMyApplications();
  }, [user]);

  const fetchMyApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await applicationsAPI.getMyApplications();
      setApplications(res.data?.applications || []);
    } catch (err) {
      setError('Failed to load your applications. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f8f8fd]">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo — links back to QuickHire home */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#4640DE] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">Q</span>
            </div>
            <span className="text-xl font-bold text-[#25324B]">QuickHire</span>
          </a>

          {/* Right side */}
          <div className="flex items-center gap-5">
            <Link to="/" className="text-sm text-[#515B6F] hover:text-[#4640DE] font-medium transition-colors">
              ← Browse Jobs
            </Link>
            <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
              <div className="w-8 h-8 bg-[#4640DE] rounded-full flex items-center justify-center shrink-0 overflow-hidden">
                {user.profileImage
                  ? <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                  : <span className="text-white text-xs font-bold uppercase">{user.name?.charAt(0) || user.email?.charAt(0) || 'U'}</span>
                }
              </div>
              <span className="text-sm font-medium text-[#25324B] capitalize hidden sm:block">
                {user.name || 'User'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-[#515B6F] hover:text-red-500 font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Profile Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-5">
            {/* Avatar with zoom + camera badge */}
            <div className="relative shrink-0">
              {/* Avatar circle — click to zoom if image exists */}
              <div
                className={`w-24 h-24 bg-[#4640DE] rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-md ${user.profileImage && !avatarUploading ? 'cursor-zoom-in' : ''}`}
                onClick={() => { if (user.profileImage && !avatarUploading) setShowLightbox(true); }}
              >
                {avatarUploading
                  ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : user.profileImage
                    ? <img src={user.profileImage} alt={user.name} className="w-full h-full object-contain" />
                    : <span className="text-white text-3xl font-bold uppercase">{user.name?.charAt(0) || user.email?.charAt(0) || 'U'}</span>
                }
              </div>
              {/* Camera badge */}
              <button
                onClick={() => avatarInputRef.current?.click()}
                disabled={avatarUploading}
                title="Change profile photo"
                className="absolute bottom-0 right-0 w-7 h-7 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center shadow hover:bg-[#4640DE] hover:border-[#4640DE] hover:text-white text-[#515B6F] transition-colors disabled:opacity-50"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#25324B] capitalize">{user.name || 'User'}</h1>
              <p className="text-sm text-[#515B6F] mt-0.5">{user.email}</p>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 capitalize">
                  {user.role?.toLowerCase() || 'user'}
                </span>
                {user.location && (
                  <span className="flex items-center gap-1 text-xs text-[#515B6F]">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {user.location}
                  </span>
                )}
                {user.phone && (
                  <span className="flex items-center gap-1 text-xs text-[#515B6F]">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    {user.phone}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={avatarUploading}
                  className="text-xs text-[#4640DE] hover:underline disabled:opacity-50"
                >
                  {avatarUploading ? 'Uploading...' : user.profileImage ? 'Change photo' : 'Upload photo'}
                </button>
                <span className="text-gray-300">|</span>
                <button onClick={openEdit} className="text-xs text-[#4640DE] hover:underline">
                  Edit profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section Title */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-[#25324B]">My Applications</h2>
            <p className="text-sm text-[#515B6F] mt-0.5">Track the status of all your job applications.</p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 px-4 py-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
            {error}
            <button onClick={fetchMyApplications} className="ml-3 underline font-medium">Retry</button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#4640DE]"></div>
          </div>
        ) : applications.length === 0 ? (
          /* Empty state */
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm text-center py-20 px-6">
            <div className="w-14 h-14 bg-[#4640DE]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-[#4640DE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-[#25324B] font-semibold text-base">No applications yet</p>
            <p className="text-[#515B6F] text-sm mt-1 mb-5">You haven&apos;t applied to any jobs yet.</p>
            <Link
              to="/"
              className="inline-block bg-[#4640DE] text-white px-6 py-2.5 rounded-sm text-sm font-semibold hover:bg-[#3730A3] transition-colors"
            >
              Find Jobs
            </Link>
          </div>
        ) : (
          /* Applications list */
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app._id}
                className="bg-white rounded-lg border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                {/* Company logo / letter */}
                <div className="shrink-0">
                  {app.job?.companyLogo ? (
                    <img
                      src={app.job.companyLogo}
                      alt={app.job.company}
                      className="w-12 h-12 rounded-lg object-contain border border-gray-100"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-[#4640DE]/10 rounded-lg flex items-center justify-center">
                      <span className="text-[#4640DE] font-bold text-lg uppercase">
                        {app.job?.company?.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Job info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-bold text-[#25324B] truncate">
                      {app.job?.title || 'Job no longer available'}
                    </h3>
                    {app.job?.jobType && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#56CDAD]/15 text-[#56CDAD] font-medium shrink-0">
                        {app.job.jobType}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#515B6F]">
                    {app.job?.company || '—'}
                    {app.job?.location && <span className="mx-1.5 text-gray-300">·</span>}
                    {app.job?.location}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Applied {app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                  </p>
                </div>

                {/* Status badge + job link */}
                <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[app.status] || 'bg-gray-100 text-gray-600'}`}>
                    {STATUS_LABELS[app.status] || app.status}
                  </span>
                  {app.job?._id && (
                    <Link
                      to={`/job/${app.job._id}`}
                      className="text-xs text-[#4640DE] hover:underline font-medium"
                    >
                      View Job →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {editMode && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-[#25324B]">Edit Profile</h3>
              <button onClick={() => setEditMode(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleProfileSave} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#25324B] mb-1.5">Full Name <span className="text-red-500">*</span></label>
                <input
                  type="text" value={editForm.name} required
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-[#25324B] placeholder-gray-400 focus:outline-none focus:border-[#4640DE] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#25324B] mb-1.5">Phone Number</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </span>
                  <input
                    type="tel" value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-[#25324B] placeholder-gray-400 focus:outline-none focus:border-[#4640DE] transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#25324B] mb-1.5">Location</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </span>
                  <input
                    type="text" value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    placeholder="e.g. New York, USA"
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-[#25324B] placeholder-gray-400 focus:outline-none focus:border-[#4640DE] transition-colors"
                  />
                </div>
              </div>
              {editError && (
                <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">{editError}</p>
              )}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditMode(false)}
                  className="flex-1 py-2.5 border border-gray-200 text-[#515B6F] rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={editSaving}
                  className="flex-1 py-2.5 bg-[#4640DE] text-white rounded-lg text-sm font-semibold hover:bg-[#3730A3] transition-colors disabled:opacity-60">
                  {editSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {showLightbox && user.profileImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setShowLightbox(false)}
        >
          <div className="relative max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={user.profileImage}
              alt={user.name}
              className="w-full h-auto rounded-xl shadow-2xl object-contain max-h-[80vh]"
            />
            {/* Close button */}
            <button
              onClick={() => setShowLightbox(false)}
              className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* Change photo button inside lightbox */}
            <button
              onClick={() => { setShowLightbox(false); avatarInputRef.current?.click(); }}
              className="mt-3 w-full py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Change photo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
