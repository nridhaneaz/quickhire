import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useJobs } from '../context/JobContext';

const categoryColors = {
  "Marketing":      { bg: "bg-orange-50", text: "text-orange-600" },
  "Design":         { bg: "bg-blue-50",   text: "text-blue-600"   },
  "Business":       { bg: "bg-green-50",  text: "text-green-600"  },
  "Technology":     { bg: "bg-purple-50", text: "text-purple-600" },
  "default":        { bg: "bg-gray-50",   text: "text-gray-600"   }
};

export default function Admin() {
  const { jobs, addJob, deleteJob, categories, addCategory, deleteCategory, locations } = useJobs();

  const [activeTab, setActiveTab] = useState('jobs');
  const [showAddJobForm, setShowAddJobForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [categorySuccess, setCategorySuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '', company: '', location: locations[1],
    type: 'Full Time', categories: [],
    description: '', fullDescription: '', salary: ''
  });

  const getCategoryStyle = (cat) => categoryColors[cat] || categoryColors.default;

  const handleJobSubmit = (e) => {
    e.preventDefault();
    addJob(formData);
    setFormData({ title: '', company: '', location: locations[1], type: 'Full Time', categories: [], description: '', fullDescription: '', salary: '' });
    setShowAddJobForm(false);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCategoryToggle = (cat) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(cat) ? prev.categories.filter(c => c !== cat) : [...prev.categories, cat]
    }));
  };

  const handleDeleteJob = (id, title) => {
    if (window.confirm(`Delete "${title}"?`)) deleteJob(id);
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    setCategoryError(''); setCategorySuccess('');
    const result = addCategory(newCategoryName);
    if (result.success) {
      const added = newCategoryName.trim();
      setNewCategoryName('');
      setCategorySuccess(`"${added}" category added!`);
      setTimeout(() => setCategorySuccess(''), 3000);
    } else {
      setCategoryError(result.error);
    }
  };

  const handleDeleteCategory = (name) => {
    if (window.confirm(`Delete "${name}" category?`)) deleteCategory(name);
  };

  return (
    <div className="min-h-screen bg-[#f8f8fd]">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#4640DE] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">Q</span>
            </div>
            <span className="text-xl font-bold text-[#25324B]">QuickHire</span>
          </Link>
          <span className="text-sm font-semibold text-[#515B6F] bg-gray-100 px-3 py-1 rounded-full">Admin Panel</span>
          <Link to="/" className="text-sm font-medium text-[#4640DE] hover:text-[#3730A3] flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Site
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Jobs', value: jobs.length, color: 'bg-blue-100', iconColor: 'text-[#4640DE]', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
            { label: 'Categories', value: categories.length, color: 'bg-purple-100', iconColor: 'text-purple-600', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
            { label: 'Companies', value: new Set(jobs.map(j => j.company)).size, color: 'bg-orange-100', iconColor: 'text-orange-600', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
          ].map(({ label, value, color, iconColor, icon }) => (
            <div key={label} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
                  <svg className={`w-6 h-6 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#25324B]">{value}</p>
                  <p className="text-sm text-[#515B6F]">{label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 bg-white rounded-lg p-1 shadow-sm w-fit">
          {['jobs', 'categories'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-md text-sm font-semibold transition-colors capitalize ${
                activeTab === tab ? 'bg-[#4640DE] text-white' : 'text-[#515B6F] hover:text-[#25324B]'
              }`}>
              {tab}
            </button>
          ))}
        </div>

        {/* JOBS TAB */}
        {activeTab === 'jobs' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#25324B]">All Job Listings</h2>
              <button onClick={() => setShowAddJobForm(true)}
                className="bg-[#4640DE] text-white px-4 py-2 rounded-sm text-sm font-semibold hover:bg-[#3730A3] transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Job
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {['Job', 'Location', 'Categories', 'Type', 'Actions'].map((h, i) => (
                      <th key={h} className={`px-6 py-3 text-xs font-medium text-[#515B6F] uppercase tracking-wider ${i === 4 ? 'text-right' : 'text-left'} ${i === 1 ? 'hidden md:table-cell' : ''} ${i === 2 ? 'hidden lg:table-cell' : ''}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 ${job.logoColor} rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0`}>{job.logo}</div>
                          <div>
                            <p className="font-medium text-[#25324B]">{job.title}</p>
                            <p className="text-sm text-[#515B6F]">{job.company}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <p className="text-sm text-[#515B6F]">{job.location}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                        <div className="flex gap-1">
                          {job.categories.slice(0, 2).map((cat) => {
                            const style = getCategoryStyle(cat);
                            return <span key={cat} className={`px-2 py-1 ${style.bg} ${style.text} text-xs font-medium rounded-full`}>{cat}</span>;
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-full">{job.type}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button onClick={() => handleDeleteJob(job.id, job.title)}
                          className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {jobs.length === 0 && <div className="text-center py-12"><p className="text-[#515B6F]">No jobs found.</p></div>}
          </div>
        )}

        {/* CATEGORIES TAB */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-[#25324B] mb-4">Add New Category</h2>
              <form onSubmit={handleAddCategory} className="flex gap-3">
                <input type="text" value={newCategoryName}
                  onChange={(e) => { setNewCategoryName(e.target.value); setCategoryError(''); }}
                  placeholder="e.g. Healthcare, Education..."
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-sm text-sm text-[#25324B] placeholder-gray-400 focus:outline-none focus:border-[#4640DE] transition-colors" />
                <button type="submit"
                  className="bg-[#4640DE] text-white px-6 py-3 rounded-sm text-sm font-semibold hover:bg-[#3730A3] transition-colors flex items-center gap-2 whitespace-nowrap">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Category
                </button>
              </form>
              {categoryError && <p className="text-red-500 text-sm mt-2">{categoryError}</p>}
              {categorySuccess && <p className="text-green-600 text-sm mt-2">✓ {categorySuccess}</p>}
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-[#25324B]">
                  All Categories <span className="text-sm font-normal text-[#515B6F]">({categories.length})</span>
                </h2>
              </div>
              <div className="divide-y divide-gray-100">
                {categories.map((cat) => {
                  const style = getCategoryStyle(cat.name);
                  return (
                    <div key={cat.name} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 ${style.bg} ${style.text} rounded-lg flex items-center justify-center font-bold text-sm`}>
                          {cat.name.charAt(0)}
                        </span>
                        <div>
                          <p className="font-medium text-[#25324B]">{cat.name}</p>
                          <p className="text-xs text-[#515B6F]">{cat.jobs} jobs available</p>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteCategory(cat.name)}
                        className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
              {categories.length === 0 && <div className="text-center py-12"><p className="text-[#515B6F]">No categories yet.</p></div>}
            </div>
          </div>
        )}
      </div>

      {/* Add Job Modal */}
      {showAddJobForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#25324B]">Add New Job</h2>
                <button onClick={() => setShowAddJobForm(false)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleJobSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#25324B] mb-1">Job Title *</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Senior Designer"
                      className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:border-[#4640DE] text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#25324B] mb-1">Company *</label>
                    <input type="text" name="company" value={formData.company} onChange={handleChange} required placeholder="e.g. Acme Inc"
                      className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:border-[#4640DE] text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#25324B] mb-1">Location *</label>
                    <select name="location" value={formData.location} onChange={handleChange} required
                      className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:border-[#4640DE] text-sm">
                      {locations.filter(l => l !== 'All Locations').map(loc => <option key={loc} value={loc}>{loc}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#25324B] mb-1">Job Type *</label>
                    <select name="type" value={formData.type} onChange={handleChange} required
                      className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:border-[#4640DE] text-sm">
                      {['Full Time', 'Part Time', 'Contract', 'Remote'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#25324B] mb-1">Salary Range *</label>
                  <input type="text" name="salary" value={formData.salary} onChange={handleChange} required placeholder="e.g. $80,000 - $120,000"
                    className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:border-[#4640DE] text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#25324B] mb-2">Categories *</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <button key={cat.name} type="button" onClick={() => handleCategoryToggle(cat.name)}
                        className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors ${
                          formData.categories.includes(cat.name) ? 'bg-[#4640DE] text-white' : 'bg-gray-100 text-[#515B6F] hover:bg-gray-200'
                        }`}>
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#25324B] mb-1">Short Description *</label>
                  <input type="text" name="description" value={formData.description} onChange={handleChange} required placeholder="Brief description..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:border-[#4640DE] text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#25324B] mb-1">Full Description *</label>
                  <textarea name="fullDescription" value={formData.fullDescription} onChange={handleChange} required rows={5} placeholder="Full job description..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:border-[#4640DE] text-sm resize-none" />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowAddJobForm(false)}
                    className="flex-1 px-4 py-3 border border-gray-200 text-[#515B6F] rounded-sm text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                  <button type="submit" disabled={formData.categories.length === 0}
                    className="flex-1 px-4 py-3 bg-[#4640DE] text-white rounded-sm text-sm font-semibold hover:bg-[#3730A3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Add Job</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}