import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useJobs } from '../context/JobContext';

const categoryColors = {
  "Marketing": { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200" },
  "Design": { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
  "Business": { bg: "bg-green-50", text: "text-green-600", border: "border-green-200" },
  "Technology": { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" },
  "default": { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200" }
};

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getJobById } = useJobs();
  const job = getJobById(id);

  const [showApplyForm, setShowApplyForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    resumeUrl: '',
    coverNote: ''
  });
  const [submitted, setSubmitted] = useState(false);

  if (!job) {
    return (
      <div className="min-h-screen bg-[#f8f8fd] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#25324B] mb-4">Job not found</h2>
          <Link to="/" className="text-[#4640DE] hover:underline">
            ← Back to jobs
          </Link>
        </div>
      </div>
    );
  }

  const getCategoryStyle = (category) => {
    return categoryColors[category] || categoryColors.default;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send data to an API
    console.log('Application submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setShowApplyForm(false);
      setSubmitted(false);
      setFormData({ name: '', email: '', resumeUrl: '', coverNote: '' });
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-[#f8f8fd]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link to="/" className="text-[#4640DE] text-sm font-medium hover:underline mb-6 inline-block">
            ← Back to jobs
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className={`w-16 h-16 ${job.logoColor} rounded-lg flex items-center justify-center text-white font-bold text-2xl shrink-0`}>
                {job.logo}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#25324B] mb-2">{job.title}</h1>
                <p className="text-[#515B6F] mb-3">
                  {job.company} • {job.location}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-full border border-green-200">
                    {job.type}
                  </span>
                  {job.categories.map((category) => {
                    const style = getCategoryStyle(category);
                    return (
                      <span key={category} className={`px-3 py-1 ${style.bg} ${style.text} text-xs font-medium rounded-full border ${style.border}`}>
                        {category}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowApplyForm(true)}
              className="bg-[#4640DE] text-white px-8 py-3 rounded-sm text-sm font-semibold hover:bg-[#3730A3] transition-colors whitespace-nowrap"
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-[#25324B] mb-6">Job Description</h2>
              <div className="prose prose-sm max-w-none text-[#515B6F]">
                {job.fullDescription.split('\n').map((paragraph, index) => {
                  if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    return (
                      <h3 key={index} className="text-lg font-semibold text-[#25324B] mt-6 mb-3">
                        {paragraph.replace(/\*\*/g, '')}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith('- ')) {
                    return (
                      <li key={index} className="ml-4 mb-2">
                        {paragraph.replace('- ', '')}
                      </li>
                    );
                  }
                  if (paragraph.trim()) {
                    return <p key={index} className="mb-4">{paragraph}</p>;
                  }
                  return null;
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-8">
              <h3 className="text-lg font-bold text-[#25324B] mb-4">Job Overview</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#f8f8fd] rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#4640DE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-[#515B6F]">Job Type</p>
                    <p className="font-medium text-[#25324B]">{job.type}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#f8f8fd] rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#4640DE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-[#515B6F]">Location</p>
                    <p className="font-medium text-[#25324B]">{job.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#f8f8fd] rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#4640DE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-[#515B6F]">Salary</p>
                    <p className="font-medium text-[#25324B]">{job.salary}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#f8f8fd] rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#4640DE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-[#515B6F]">Company</p>
                    <p className="font-medium text-[#25324B]">{job.company}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowApplyForm(true)}
                className="w-full mt-6 bg-[#4640DE] text-white py-3 rounded-sm text-sm font-semibold hover:bg-[#3730A3] transition-colors"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Form Modal */}
      {showApplyForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#25324B]">Apply for {job.title}</h2>
                <button 
                  onClick={() => setShowApplyForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-[#25324B] mb-2">Application Submitted!</h3>
                  <p className="text-[#515B6F]">Thank you for applying. We'll be in touch soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#25324B] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:border-[#4640DE] text-sm"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#25324B] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:border-[#4640DE] text-sm"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#25324B] mb-1">
                      Resume Link (URL) *
                    </label>
                    <input
                      type="url"
                      name="resumeUrl"
                      value={formData.resumeUrl}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:border-[#4640DE] text-sm"
                      placeholder="https://drive.google.com/your-resume"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#25324B] mb-1">
                      Cover Note *
                    </label>
                    <textarea
                      name="coverNote"
                      value={formData.coverNote}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:border-[#4640DE] text-sm resize-none"
                      placeholder="Tell us why you're a great fit for this role..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowApplyForm(false)}
                      className="flex-1 px-4 py-3 border border-gray-200 text-[#515B6F] rounded-sm text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-[#4640DE] text-white rounded-sm text-sm font-semibold hover:bg-[#3730A3] transition-colors"
                    >
                      Submit Application
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
