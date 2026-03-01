import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useJobs } from '../context/JobContext';
import { useToast } from '../context/ToastContext';
import { adminApplicationsAPI, adminUsersAPI, adminBroadcastAPI, jobsAPI } from '../lib/api';

export default function Admin() {
  const { admin: user, logout } = useAdminAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const {
    jobs, addJob, updateJob, deleteJob, toggleJobStatus,
    categories, addCategory, updateCategory, deleteCategory, toggleCategoryStatus,
    fetchJobs, fetchCategories,
    locations,
  } = useJobs();

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('adminActiveTab') || 'jobs';
  });
  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);

  // ── Users ─────────────────────────────────────────────────────
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // ── Broadcast ─────────────────────────────────────────────────
  const [subscribers, setSubscribers] = useState([]);
  const [subscribersLoading, setSubscribersLoading] = useState(false);
  const [broadcasts, setBroadcasts] = useState([]);
  const [broadcastsLoading, setBroadcastsLoading] = useState(false);
  const [showBroadcastForm, setShowBroadcastForm] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({
    subject: '',
    html: '',
    email: '',
  });
  const [broadcastMsg, setBroadcastMsg] = useState({ type: '', text: '' });
  const [broadcastType, setBroadcastType] = useState('all'); // 'all' or 'specific'

  // ── New Job Form ─────────────────────────────────────────────
  const [showJobForm, setShowJobForm] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: '', company: '', location: '', jobType: 'Full Time',
    about: '', salary_min: '', salary_max: '', category: '',
    responsibilities: '', requirements: '', tags: '',
  });
  const [jobMsg, setJobMsg] = useState({ type: '', text: '' });

  // ── Job Logo File ─────────────────────────────────────────
  const [jobLogoFile, setJobLogoFile] = useState(null);

  // ── Derived location list (drop ‘All Locations’ sentinel) ─────────
  const JOB_LOCATIONS = locations.filter((l) => l !== 'All Locations');

  // ── Edit Job Modal ───────────────────────────────────────
  const [editJob, setEditJob]           = useState(null);
  const [editForm, setEditForm]         = useState({
    title: '', company: '', location: '', jobType: 'Full Time',
    about: '', salary_min: '', salary_max: '', category: '',
    responsibilities: '', requirements: '', tags: '', currentLogo: '',
  });
  const [editLogoFile, setEditLogoFile]     = useState(null);
  const [editJobMsg, setEditJobMsg]         = useState({ type: '', text: '' });
  const [editJobLoading, setEditJobLoading] = useState(false);

  const openEditJob = async (job) => {
    setEditJobMsg({ type: '', text: '' });
    setEditLogoFile(null);
    try {
      const res = await jobsAPI.getById(job.id);
      const j   = res.data;
      setEditForm({
        title:            j.title          || '',
        company:          j.company        || '',
        location:         j.location       || '',
        jobType:          j.jobType        || 'Full Time',
        about:            j.about          || '',
        salary_min:       j.salary?.min    ?? '',
        salary_max:       j.salary?.max    ?? '',
        category:         j.category?._id  || '',
        responsibilities: (j.responsibilities || []).join('\n'),
        requirements:     (j.requirements    || []).join('\n'),
        tags:             (j.tags            || []).join(', '),
        currentLogo:      j.companyLogo      || '',
        status:           j.status           || 'ACTIVE',
      });
      setEditJob(job);
    } catch (err) { console.error(err); }
  };

  const closeEditJob = () => { setEditJob(null); setEditLogoFile(null); };

  const handleEditJobSubmit = async (e) => {
    e.preventDefault();
    setEditJobLoading(true);
    setEditJobMsg({ type: '', text: '' });
    try {
      await updateJob(editJob.id, {
        title:            editForm.title,
        company:          editForm.company,
        location:         editForm.location,
        jobType:          editForm.jobType,
        about:            editForm.about,
        salary_min:       editForm.salary_min,
        salary_max:       editForm.salary_max,
        category:         editForm.category,
        responsibilities: editForm.responsibilities.split('\n').filter(Boolean),
        requirements:     editForm.requirements.split('\n').filter(Boolean),
        tags:             editForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
        companyLogoFile:  editLogoFile,
        status:           editForm.status,
      });
      setEditJobMsg({ type: 'success', text: 'Job updated!' });
      addToast('Job updated successfully!', 'success');
      setTimeout(closeEditJob, 800);
    } catch (err) {
      setEditJobMsg({ type: 'error', text: err.message });
      addToast(err.message || 'Failed to update job', 'error');
    } finally {
      setEditJobLoading(false);
    }
  };

  // ── New Category Form ─────────────────────────────────────────
  const [newCatName, setNewCatName] = useState('');
  const [newCatImage, setNewCatImage] = useState(null);
  const [catMsg, setCatMsg] = useState({ type: '', text: '' });

  // ── Edit Category Modal ───────────────────────────────────────
  const [editCat, setEditCat] = useState(null); // { id, name, image } | null
  const [editCatName, setEditCatName] = useState('');
  const [editCatImage, setEditCatImage] = useState(null);
  const [editCatMsg, setEditCatMsg] = useState({ type: '', text: '' });
  const [editCatLoading, setEditCatLoading] = useState(false);

  const openEditCat = (cat) => {
    setEditCat(cat);
    setEditCatName(cat.name);
    setEditCatImage(null);
    setEditCatMsg({ type: '', text: '' });
  };
  const closeEditCat = () => { setEditCat(null); setEditCatImage(null); };

  const handleEditCatSubmit = async (e) => {
    e.preventDefault();
    setEditCatLoading(true);
    setEditCatMsg({ type: '', text: '' });
    const result = await updateCategory(editCat.id, editCatName, editCatImage);
    setEditCatLoading(false);
    if (result.success) {
      setEditCatMsg({ type: 'success', text: 'Category updated!' });
      addToast('Category updated successfully!', 'success');
      setTimeout(closeEditCat, 800);
    } else {
      setEditCatMsg({ type: 'error', text: result.error });
      addToast(result.error || 'Failed to update category', 'error');
    }
  };
  // ── View Application Modal ───────────────────────────────────
  const [viewApp, setViewApp]         = useState(null);
  const [viewAppLoading, setViewAppLoading] = useState(false);

  const handleViewApp = async (id) => {
    setViewApp({ _id: id, _loading: true });
    setViewAppLoading(true);
    try {
      const res = await adminApplicationsAPI.getById(id);
      setViewApp(res.data);
    } catch (err) {
      console.error(err);
      setViewApp(null);
    } finally {
      setViewAppLoading(false);
    }
  };
  // ── Fetch Applications ────────────────────────────────────────
  useEffect(() => {
    if (activeTab === 'applications') loadApplications();
    if (activeTab === 'users') loadUsers();
    if (activeTab === 'broadcast') {
      loadSubscribers();
      loadBroadcasts();
    }
  }, [activeTab]);

  // Load applications and users data on mount for stats
  useEffect(() => {
    loadApplications();
    loadUsers();
  }, []);

  // Save active tab to localStorage
  useEffect(() => {
    localStorage.setItem('adminActiveTab', activeTab);
  }, [activeTab]);

  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      const data = await adminUsersAPI.getAll({ limit: 100 });
      setUsers(data.data?.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setUsersLoading(false);
    }
  };

  const loadApplications = async () => {
    setAppsLoading(true);
    try {
      const data = await adminApplicationsAPI.getAll({ limit: 50 });
      setApplications(data.data?.applications || []);
    } catch (err) {
      console.error(err);
    } finally {
      setAppsLoading(false);
    }
  };

  const loadSubscribers = async () => {
    setSubscribersLoading(true);
    try {
      const data = await adminBroadcastAPI.getAllSubscribers({ limit: 100 });
      setSubscribers(data.data?.subscribers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setSubscribersLoading(false);
    }
  };

  const loadBroadcasts = async () => {
    setBroadcastsLoading(true);
    try {
      const data = await adminBroadcastAPI.getAllBroadcasts({ limit: 50 });
      setBroadcasts(data.data?.broadcasts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setBroadcastsLoading(false);
    }
  };

  const handleDeleteSubscriber = async (id) => {
    if (!confirm('Delete this subscriber?')) return;
    try {
      await adminBroadcastAPI.deleteSubscriber(id);
      await loadSubscribers();
      addToast('Subscriber deleted successfully', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to delete subscriber', 'error');
    }
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    setBroadcastMsg({ type: '', text: '' });
    
    try {
      if (broadcastType === 'all') {
        const result = await adminBroadcastAPI.sendToAll({
          subject: broadcastForm.subject,
          html: broadcastForm.html,
        });
        setBroadcastMsg({ type: 'success', text: `Broadcast sent to ${result.data.sent} subscribers!` });
        addToast(`Broadcast sent to ${result.data.sent} subscribers!`, 'success');
      } else {
        await adminBroadcastAPI.sendToSpecific({
          email: broadcastForm.email,
          subject: broadcastForm.subject,
          html: broadcastForm.html,
        });
        setBroadcastMsg({ type: 'success', text: 'Broadcast sent successfully!' });
        addToast('Broadcast sent successfully!', 'success');
      }
      
      setBroadcastForm({ subject: '', html: '', email: '' });
      setShowBroadcastForm(false);
      await loadBroadcasts();
    } catch (err) {
      setBroadcastMsg({ type: 'error', text: err.message });
      addToast(err.message || 'Failed to send broadcast', 'error');
    }
  };

  const handleDeleteBroadcast = async (id) => {
    if (!confirm('Delete this broadcast record?')) return;
    try {
      await adminBroadcastAPI.deleteBroadcast(id);
      await loadBroadcasts();
      addToast('Broadcast record deleted', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to delete broadcast', 'error');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await adminApplicationsAPI.updateStatus(id, { status });
      setApplications((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status } : a))
      );
      addToast(`Application status updated to ${status}`, 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to update application status', 'error');
    }
  };

  const handleDeleteApp = async (id) => {
    if (!confirm('Delete this application?')) return;
    try {
      await adminApplicationsAPI.delete(id);
      setApplications((prev) => prev.filter((a) => a._id !== id));
      addToast('Application deleted successfully', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to delete application', 'error');
    }
  };

  // ── Job submit ────────────────────────────────────────────────
  const handleJobSubmit = async (e) => {
    e.preventDefault();
    setJobMsg({ type: '', text: '' });
    try {
      await addJob({
        title:            jobForm.title,
        company:          jobForm.company,
        location:         jobForm.location,
        jobType:          jobForm.jobType,
        about:            jobForm.about,
        salary_min:       jobForm.salary_min,
        salary_max:       jobForm.salary_max,
        category:         jobForm.category,
        responsibilities: jobForm.responsibilities.split('\n').filter(Boolean),
        requirements:     jobForm.requirements.split('\n').filter(Boolean),
        tags:             jobForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
        companyLogoFile:  jobLogoFile,
      });
      setJobMsg({ type: 'success', text: 'Job created successfully!' });
      addToast('Job created successfully!', 'success');
      setJobForm({ title: '', company: '', location: '', jobType: 'Full Time', about: '', salary_min: '', salary_max: '', category: '', responsibilities: '', requirements: '', tags: '' });
      setJobLogoFile(null);
      const fi = document.getElementById('job-logo-input');
      if (fi) fi.value = '';
      setShowJobForm(false);
    } catch (err) {
      setJobMsg({ type: 'error', text: err.message });
      addToast(err.message || 'Failed to create job', 'error');
    }
  };

  // ── Category submit ───────────────────────────────────────────
  const handleAddCategory = async (e) => {
    e.preventDefault();
    setCatMsg({ type: '', text: '' });
    const result = await addCategory(newCatName, newCatImage);
    if (result.success) {
      setCatMsg({ type: 'success', text: `"${newCatName}" added!` });
      addToast(`Category "${newCatName}" added successfully!`, 'success');
      setNewCatName('');
      setNewCatImage(null);
      // reset file input
      const fi = document.getElementById('cat-image-input');
      if (fi) fi.value = '';
    } else {
      setCatMsg({ type: 'error', text: result.error });
      addToast(result.error || 'Failed to add category', 'error');
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    const result = await deleteCategory(id);
    if (result.success) {
      addToast(`Category "${name}" deleted successfully`, 'success');
    } else {
      setCatMsg({ type: 'error', text: result.error });
      addToast(result.error || 'Failed to delete category', 'error');
    }
  };

  const handleDeleteJob = async (id, title) => {
    if (!confirm(`Delete job "${title}"?`)) return;
    try {
      await deleteJob(id);
      addToast(`Job "${title}" deleted successfully`, 'success');
    } catch (err) {
      addToast('Failed to delete job', 'error');
    }
  };

  const handleToggleJobStatus = async (id, currentStatus) => {
    try {
      await toggleJobStatus(id, currentStatus);
      const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      addToast(`Job status changed to ${newStatus}`, 'success');
    } catch (err) {
      addToast('Failed to update job status', 'error');
    }
  };

  const handleToggleCategoryStatus = async (id, isActive) => {
    try {
      await toggleCategoryStatus(id, isActive);
      const newStatus = isActive ? 'Inactive' : 'Active';
      addToast(`Category status changed to ${newStatus}`, 'success');
    } catch (err) {
      addToast('Failed to update category status', 'error');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const STATUS_COLORS = {
    PENDING:  'bg-yellow-100 text-yellow-700',
    REVIEWED: 'bg-blue-100 text-blue-700',
    ACCEPTED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
  };

  return (
    <div className="min-h-screen bg-[#f8f8fd]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#4640DE] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">Q</span>
            </div>
            <span className="text-xl font-bold text-[#25324B]">QuickHire</span>
            <span className="text-xs bg-[#4640DE] text-white px-2 py-0.5 rounded-full font-medium ml-1">
              Admin Panel
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#515B6F]">Hi, {user?.name}</span>
            <Link to="/" className="text-sm text-[#4640DE] hover:underline">← Back to Site</Link>
            <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700 font-medium">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Jobs', value: jobs.length, color: 'text-[#4640DE]' },
            { label: 'Categories', value: categories.length, color: 'text-[#56CDAD]' },
            { label: 'Applications', value: applications.length, color: 'text-[#FFB836]' },
            { label: 'Users', value: users.length, color: 'text-[#FF6550]' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <p className="text-sm text-[#515B6F]">{label}</p>
              <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit mb-6">
          {[
            { key: 'jobs', label: 'Jobs' },
            { key: 'categories', label: 'Categories' },
            { key: 'applications', label: 'Applications' },
            { key: 'users', label: 'Users' },
            { key: 'broadcast', label: 'Subscribers' },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`px-5 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === key
                  ? 'bg-white text-[#4640DE] shadow-sm'
                  : 'text-[#515B6F] hover:text-[#25324B]'
              }`}>
              {label}
            </button>
          ))}
        </div>

        {/* ── JOBS TAB ───────────────────────────────────────────── */}
        {activeTab === 'jobs' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-[#25324B]">All Jobs</h2>
              <button onClick={() => setShowJobForm(!showJobForm)}
                className="bg-[#4640DE] text-white px-4 py-2 rounded-sm text-sm font-semibold hover:bg-[#3730A3] transition-colors">
                + Add Job
              </button>
            </div>

            {/* Add Job Form */}
            {showJobForm && (
              <div className="p-6 border-b border-gray-100 bg-gray-50">
                <h3 className="font-semibold text-[#25324B] mb-4">New Job</h3>
                <form onSubmit={handleJobSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Job Title *', name: 'title', required: true },
                    { label: 'Company *', name: 'company', required: true },
                    { label: 'Salary Min', name: 'salary_min', type: 'number' },
                    { label: 'Salary Max', name: 'salary_max', type: 'number' },
                  ].map(({ label, name, required, type = 'text' }) => (
                    <div key={name}>
                      <label className="block text-xs font-medium text-[#515B6F] mb-1">{label}</label>
                      <input type={type} value={jobForm[name]} required={required}
                        onChange={(e) => setJobForm({ ...jobForm, [name]: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-[#4640DE]"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-xs font-medium text-[#515B6F] mb-1">Location</label>
                    <select value={jobForm.location}
                      onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-[#4640DE]">
                      <option value="">Select location</option>
                      {JOB_LOCATIONS.map((l) => <option key={l}>{l}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#515B6F] mb-1">Job Type</label>
                    <select value={jobForm.jobType}
                      onChange={(e) => setJobForm({ ...jobForm, jobType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-[#4640DE]">
                      {['Full Time', 'Part Time', 'Remote', 'Contract', 'Internship'].map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#515B6F] mb-1">Category *</label>
                    <select value={jobForm.category} required
                      onChange={(e) => setJobForm({ ...jobForm, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-[#4640DE]">
                      <option value="">Select category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-[#515B6F] mb-1">About the Role</label>
                    <textarea value={jobForm.about} rows={3}
                      onChange={(e) => setJobForm({ ...jobForm, about: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-[#4640DE] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#515B6F] mb-1">Responsibilities (one per line)</label>
                    <textarea value={jobForm.responsibilities} rows={3}
                      onChange={(e) => setJobForm({ ...jobForm, responsibilities: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-[#4640DE] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#515B6F] mb-1">Requirements (one per line)</label>
                    <textarea value={jobForm.requirements} rows={3}
                      onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-[#4640DE] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#515B6F] mb-1">Tags (comma separated)</label>
                    <input value={jobForm.tags}
                      onChange={(e) => setJobForm({ ...jobForm, tags: e.target.value })}
                      placeholder="React, Node.js, MongoDB"
                      className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-[#4640DE]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#515B6F] mb-1">Company Logo</label>
                    <input
                      id="job-logo-input"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setJobLogoFile(e.target.files[0] || null)}
                      className="w-full text-sm text-[#515B6F] file:mr-3 file:py-1.5 file:px-3 file:rounded-sm file:border-0 file:text-xs file:font-semibold file:bg-[#4640DE] file:text-white hover:file:bg-[#3730A3] cursor-pointer"
                    />
                  </div>

                  {jobMsg.text && (
                    <div className={`md:col-span-2 px-4 py-2 rounded-sm text-sm ${
                      jobMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                    }`}>
                      {jobMsg.text}
                    </div>
                  )}

                  <div className="md:col-span-2 flex gap-3">
                    <button type="submit"
                      className="bg-[#4640DE] text-white px-6 py-2 rounded-sm text-sm font-semibold hover:bg-[#3730A3]">
                      Create Job
                    </button>
                    <button type="button" onClick={() => setShowJobForm(false)}
                      className="px-6 py-2 border border-gray-200 text-[#515B6F] rounded-sm text-sm font-medium hover:bg-gray-50">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Jobs Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Job Title', 'Company', 'Location', 'Type', 'Status', 'Action'].map((h) => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-[#515B6F] uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 ${job.logoColor} rounded-md flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                            {job.logo}
                          </div>
                          <span className="font-medium text-[#25324B] text-sm">{job.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#515B6F]">{job.company}</td>
                      <td className="px-6 py-4 text-sm text-[#515B6F]">{job.location}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                          {job.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleJobStatus(job.id, job.status)}
                          className={`px-2 py-1 text-xs font-medium rounded-full cursor-pointer transition-colors ${
                            job.status === 'ACTIVE' 
                              ? 'bg-green-50 text-green-600 hover:bg-green-100' 
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          {job.status}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button onClick={() => openEditJob(job)}
                            className="text-[#4640DE] hover:text-[#3730A3] transition-colors text-sm font-medium">
                            Edit
                          </button>
                          <button onClick={() => handleDeleteJob(job.id, job.title)}
                            className="text-red-400 hover:text-red-600 transition-colors text-sm">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {jobs.length === 0 && (
                <div className="text-center py-12 text-[#515B6F]">No jobs yet. Add your first job!</div>
              )}
            </div>
          </div>
        )}
        {/* ── EDIT JOB MODAL ────────────────────────────────────── */}
        {editJob && (
          <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 py-8 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 my-auto">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-[#25324B]">Edit Job</h3>
                <button onClick={closeEditJob} className="text-[#515B6F] hover:text-[#25324B] text-xl leading-none">&times;</button>
              </div>
              <form onSubmit={handleEditJobSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Job Title *', key: 'title', required: true },
                  { label: 'Company *',   key: 'company', required: true },
                  { label: 'Salary Min',  key: 'salary_min', type: 'number' },
                  { label: 'Salary Max',  key: 'salary_max', type: 'number' },
                ].map(({ label, key, required, type = 'text' }) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-[#515B6F] mb-1">{label}</label>
                    <input type={type} value={editForm[key]} required={required}
                      onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-[#4640DE]"
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-xs font-medium text-[#515B6F] mb-1">Location</label>
                  <select value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-[#4640DE]">
                    <option value="">Select location</option>
                    {JOB_LOCATIONS.map((l) => <option key={l}>{l}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#515B6F] mb-1">Job Type</label>
                  <select value={editForm.jobType}
                    onChange={(e) => setEditForm({ ...editForm, jobType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-[#4640DE]">
                    {['Full Time', 'Part Time', 'Remote', 'Contract', 'Internship'].map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#515B6F] mb-1">Status</label>
                  <select value={editForm.status || 'ACTIVE'}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-[#4640DE]">
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#515B6F] mb-1">Category *</label>
                  <select value={editForm.category} required
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-[#4640DE]">
                    <option value="">Select category</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#515B6F] mb-1">Tags (comma separated)</label>
                  <input value={editForm.tags}
                    onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-[#4640DE]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-[#515B6F] mb-1">About the Role</label>
                  <textarea value={editForm.about} rows={3}
                    onChange={(e) => setEditForm({ ...editForm, about: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-[#4640DE] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#515B6F] mb-1">Responsibilities (one per line)</label>
                  <textarea value={editForm.responsibilities} rows={3}
                    onChange={(e) => setEditForm({ ...editForm, responsibilities: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-[#4640DE] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#515B6F] mb-1">Requirements (one per line)</label>
                  <textarea value={editForm.requirements} rows={3}
                    onChange={(e) => setEditForm({ ...editForm, requirements: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-[#4640DE] resize-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-[#515B6F] mb-1">Company Logo (leave empty to keep current)</label>
                  {editForm.currentLogo && !editLogoFile && (
                    <img src={editForm.currentLogo} alt="logo" className="w-10 h-10 object-contain rounded border border-gray-100 mb-2" />
                  )}
                  <input type="file" accept="image/*"
                    onChange={(e) => setEditLogoFile(e.target.files[0] || null)}
                    className="w-full text-sm text-[#515B6F] file:mr-3 file:py-1.5 file:px-3 file:rounded-sm file:border-0 file:text-xs file:font-semibold file:bg-[#4640DE] file:text-white hover:file:bg-[#3730A3] cursor-pointer"
                  />
                </div>

                {editJobMsg.text && (
                  <div className={`md:col-span-2 px-4 py-2 rounded-sm text-sm ${
                    editJobMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                  }`}>
                    {editJobMsg.text}
                  </div>
                )}

                <div className="md:col-span-2 flex justify-end gap-3 pt-1">
                  <button type="button" onClick={closeEditJob}
                    className="px-4 py-2 text-sm border border-gray-200 rounded-sm text-[#515B6F] hover:bg-gray-50">
                    Cancel
                  </button>
                  <button type="submit" disabled={editJobLoading}
                    className="px-6 py-2 text-sm bg-[#4640DE] text-white rounded-sm font-semibold hover:bg-[#3730A3] disabled:opacity-60">
                    {editJobLoading ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* ── CATEGORIES TAB ────────────────────────────────────── */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-[#25324B] mb-4">Add Category</h2>
              <form onSubmit={handleAddCategory} className="flex flex-wrap gap-3 items-end">
                <div className="flex-1 min-w-[180px]">
                  <label className="block text-xs font-medium text-[#515B6F] mb-1">Category Name *</label>
                  <input value={newCatName} onChange={(e) => setNewCatName(e.target.value)}
                    required placeholder="e.g. Marketing"
                    className="w-full px-4 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-[#4640DE]"
                  />
                </div>
                <div className="flex-1 min-w-[180px]">
                  <label className="block text-xs font-medium text-[#515B6F] mb-1">Category Image</label>
                  <input
                    id="cat-image-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewCatImage(e.target.files[0] || null)}
                    className="w-full text-sm text-[#515B6F] file:mr-3 file:py-1.5 file:px-3 file:rounded-sm file:border-0 file:text-xs file:font-semibold file:bg-[#4640DE] file:text-white hover:file:bg-[#3730A3] cursor-pointer"
                  />
                </div>
                <button type="submit"
                  className="bg-[#4640DE] text-white px-5 py-2 rounded-sm text-sm font-semibold hover:bg-[#3730A3] whitespace-nowrap">
                  Add Category
                </button>
              </form>
              {catMsg.text && (
                <p className={`mt-3 text-sm ${catMsg.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                  {catMsg.type === 'success' ? '✓ ' : '⚠ '}{catMsg.text}
                </p>
              )}
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-[#4640DE] transition-colors">
                    <div className="flex items-center gap-3">
                      {cat.image ? (
                        <img src={cat.image} alt={cat.name}
                          className="w-9 h-9 rounded-lg object-cover border border-gray-100" />
                      ) : (
                        <div className="w-9 h-9 bg-[#4640DE] rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {cat.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-[#25324B] text-sm">{cat.name}</p>
                        <p className="text-xs text-[#515B6F]">{cat.jobs} jobs</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Status badge */}
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        cat.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {cat.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {/* Toggle status */}
                      <button
                        onClick={() => handleToggleCategoryStatus(cat.id, cat.isActive)}
                        title={cat.isActive ? 'Deactivate category' : 'Activate category'}
                        className={`transition-colors ${
                          cat.isActive
                            ? 'text-green-500 hover:text-green-700'
                            : 'text-gray-400 hover:text-green-500'
                        }`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
                        </svg>
                      </button>
                      {/* Edit */}
                      <button
                        onClick={() => openEditCat(cat)}
                        title="Edit category"
                        className="text-[#4640DE] hover:text-[#3730A3] transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 2.828L11.828 15.828A2 2 0 0110 16.414H8v-2a2 2 0 01.586-1.414z" />
                        </svg>
                      </button>
                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        disabled={cat.jobs > 0}
                        title={cat.jobs > 0 ? `Cannot delete — ${cat.jobs} job(s) linked` : 'Delete category'}
                        className={`transition-colors ${cat.jobs > 0 ? 'text-gray-300 cursor-not-allowed' : 'text-red-400 hover:text-red-600'}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {categories.length === 0 && (
                <div className="text-center py-8 text-[#515B6F] text-sm">No categories yet.</div>
              )}
            </div>
          </div>
        )}

        {/* ── VIEW APPLICATION MODAL ────────────────────────────── */}
        {viewApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-[#25324B]">Application Detail</h3>
                <button onClick={() => setViewApp(null)} className="text-[#515B6F] hover:text-[#25324B] text-xl leading-none">&times;</button>
              </div>
              {viewAppLoading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4640DE]"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {[
                    { label: 'Applicant',  value: viewApp.fullName },
                    { label: 'Email',      value: viewApp.email },
                    { label: 'Job',        value: viewApp.job?.title },
                    { label: 'Company',    value: viewApp.job?.company },
                    { label: 'Status',     value: viewApp.status },
                    { label: 'Applied',    value: viewApp.createdAt ? new Date(viewApp.createdAt).toLocaleDateString() : '—' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex gap-3">
                      <span className="w-24 text-xs font-semibold text-[#515B6F] uppercase shrink-0 pt-0.5">{label}</span>
                      <span className="text-sm text-[#25324B]">{value || '—'}</span>
                    </div>
                  ))}
                  {viewApp.resumeLink && (
                    <div className="flex gap-3">
                      <span className="w-24 text-xs font-semibold text-[#515B6F] uppercase shrink-0 pt-0.5">Resume</span>
                      <a href={viewApp.resumeLink} target="_blank" rel="noreferrer"
                        className="text-sm text-[#4640DE] hover:underline break-all">{viewApp.resumeLink}</a>
                    </div>
                  )}
                  {viewApp.coverNote && (
                    <div className="flex gap-3">
                      <span className="w-24 text-xs font-semibold text-[#515B6F] uppercase shrink-0 pt-0.5">Cover Note</span>
                      <p className="text-sm text-[#25324B] whitespace-pre-wrap">{viewApp.coverNote}</p>
                    </div>
                  )}
                  <div className="pt-3 flex justify-end">
                    <button onClick={() => setViewApp(null)}
                      className="px-5 py-2 text-sm bg-[#4640DE] text-white rounded-sm font-semibold hover:bg-[#3730A3]">
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── EDIT CATEGORY MODAL ───────────────────────────────── */}
        {editCat && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-[#25324B]">Edit Category</h3>
                <button onClick={closeEditCat} className="text-[#515B6F] hover:text-[#25324B] text-xl leading-none">&times;</button>
              </div>
              <form onSubmit={handleEditCatSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#515B6F] mb-1">Category Name *</label>
                  <input
                    value={editCatName}
                    onChange={(e) => setEditCatName(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-[#4640DE]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#515B6F] mb-1">New Image (optional)</label>
                  {editCat.image && !editCatImage && (
                    <img src={editCat.image} alt="current" className="w-14 h-14 rounded-lg object-cover border border-gray-100 mb-2" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditCatImage(e.target.files[0] || null)}
                    className="w-full text-sm text-[#515B6F] file:mr-3 file:py-1.5 file:px-3 file:rounded-sm file:border-0 file:text-xs file:font-semibold file:bg-[#4640DE] file:text-white hover:file:bg-[#3730A3] cursor-pointer"
                  />
                </div>
                {editCatMsg.text && (
                  <p className={`text-sm ${editCatMsg.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                    {editCatMsg.type === 'success' ? '✓ ' : '⚠ '}{editCatMsg.text}
                  </p>
                )}
                <div className="flex justify-end gap-3 pt-1">
                  <button type="button" onClick={closeEditCat}
                    className="px-4 py-2 text-sm border border-gray-200 rounded-sm text-[#515B6F] hover:bg-gray-50">
                    Cancel
                  </button>
                  <button type="submit" disabled={editCatLoading}
                    className="px-5 py-2 text-sm bg-[#4640DE] text-white rounded-sm font-semibold hover:bg-[#3730A3] disabled:opacity-60">
                    {editCatLoading ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── APPLICATIONS TAB ──────────────────────────────────── */}
        {activeTab === 'applications' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-[#25324B]">All Applications</h2>
            </div>
            {appsLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4640DE]"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {['Applicant', 'Job', 'Email', 'Status', 'Actions'].map((h) => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-[#515B6F] uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {applications.map((app) => (
                      <tr key={app._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-[#25324B]">{app.fullName}</td>
                        <td className="px-6 py-4 text-sm text-[#515B6F]">{app.job?.title || '—'}</td>
                        <td className="px-6 py-4 text-sm text-[#515B6F]">{app.email}</td>
                        <td className="px-6 py-4">
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusChange(app._id, e.target.value)}
                            className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#4640DE] ${STATUS_COLORS[app.status] || 'bg-gray-100 text-gray-600'}`}
                          >
                            {['PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED'].map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <button onClick={() => handleViewApp(app._id)}
                              className="text-[#4640DE] hover:text-[#3730A3] text-xs font-medium">
                              View
                            </button>
                            <button onClick={() => handleDeleteApp(app._id)}
                              className="text-red-400 hover:text-red-600 text-xs">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {applications.length === 0 && (
                  <div className="text-center py-12 text-[#515B6F] text-sm">No applications yet.</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── USERS TAB ─────────────────────────────────────────── */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-[#25324B]">All Users</h2>
              <p className="text-xs text-[#515B6F] mt-1">Read-only — manage accounts via backend if needed.</p>
            </div>
            {usersLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4640DE]"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {['Name', 'Email', 'Role'].map((h) => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-[#515B6F] uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#4640DE]/10 rounded-full flex items-center justify-center shrink-0">
                              <span className="text-[#4640DE] text-xs font-bold uppercase">
                                {u.name?.charAt(0) || u.email?.charAt(0) || '?'}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-[#25324B]">{u.name || '—'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#515B6F]">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700 capitalize">
                            {u.role?.toLowerCase() || 'user'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && (
                  <div className="text-center py-12 text-[#515B6F] text-sm">No users found.</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── SUBSCRIBERS TAB ─────────────────────────────────────── */}
        {activeTab === 'broadcast' && (
          <div className="space-y-6">
            {/* Subscribers List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-[#25324B]">All Subscribers</h2>
                <p className="text-xs text-[#515B6F] mt-1">Total: {subscribers.length}</p>
              </div>
              {subscribersLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4640DE]"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        {['Email', 'Subscribed Date', 'Actions'].map((h) => (
                          <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-[#515B6F] uppercase tracking-wider">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {subscribers.map((sub) => (
                        <tr key={sub._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-[#25324B]">{sub.email}</td>
                          <td className="px-6 py-4 text-sm text-[#515B6F]">
                            {new Date(sub.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <button onClick={() => handleDeleteSubscriber(sub._id)}
                              className="text-xs font-semibold px-3 py-1.5 rounded-sm bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {subscribers.length === 0 && (
                    <div className="text-center py-12 text-[#515B6F] text-sm">No subscribers found.</div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// end