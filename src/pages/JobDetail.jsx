import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useJobs } from '../context/JobContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { applicationsAPI } from '../lib/api';

const categoryColors = {
  "Marketing": { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200" },
  "Design":    { bg: "bg-blue-50",   text: "text-blue-600",   border: "border-blue-200" },
  "Business":  { bg: "bg-green-50",  text: "text-green-600",  border: "border-green-200" },
  "Technology":{ bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" },
  "default":   { bg: "bg-gray-50",   text: "text-gray-600",   border: "border-gray-200" },
};

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { getJobById, getJobFromAPI, jobsLoading } = useJobs();
  const { user } = useAuth();

  const [apiJob, setApiJob] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);

  // Fetch directly from API if the job is not in context (e.g. direct URL navigation)
  useEffect(() => {
    if (!jobsLoading && !getJobById(id)) {
      setApiLoading(true);
      getJobFromAPI(id)
        .then((j) => setApiJob(j))
        .finally(() => setApiLoading(false));
    }
  }, [id, jobsLoading, getJobById, getJobFromAPI]);

  const job = getJobById(id) || apiJob;
  const isLoading = jobsLoading || apiLoading;

  const [showApplyForm, setShowApplyForm] = useState(false);
  const [formData, setFormData] = useState({ email: '', resumeLink: '', coverNote: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  // Check if the logged-in user already applied for this job
  useEffect(() => {
    if (!user) return;
    applicationsAPI.getMyApplications({ limit: 100 })
      .then((res) => {
        const apps = res?.data?.applications || res?.data || [];
        const found = apps.some(
          (app) => (app.job?._id || app.job) === id
        );
        if (found) setAlreadyApplied(true);
      })
      .catch(() => {});
  }, [id, user]);

  // Derive applicant name from email: john.doe@gmail.com → "John Doe"
  const nameFromEmail = (email) =>
    email.split('@')[0]
      .split(/[._-]/)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(' ') || 'Applicant';

  // Handle apply button click with login check
  const handleApplyClick = () => {
    if (!user) {
      addToast('Please login or register to apply for jobs', 'warning', 4000);
      navigate('/login', { state: { from: `/job/${id}` } });
      return;
    }
    setShowApplyForm(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4640DE]"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-[#f8f8fd] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#25324B] mb-4">Job not found</h2>
          <Link to="/" className="text-[#4640DE] hover:underline">← Back to jobs</Link>
        </div>
      </div>
    );
  }

  const getCategoryStyle = (cat) => categoryColors[cat] || categoryColors.default;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setApplyError('');
    try {
      await applicationsAPI.apply({
        job: id,
        fullName: nameFromEmail(formData.email),
        email: formData.email,
        resumeLink: formData.resumeLink,
        coverNote: formData.coverNote,
      });
      setSubmitted(true);
      setAlreadyApplied(true);
      setTimeout(() => {
        setShowApplyForm(false);
        setSubmitted(false);
        setFormData({ email: '', resumeLink: '', coverNote: '' });
      }, 3000);
    } catch (err) {
      setApplyError(err.message || 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
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
                <p className="text-[#515B6F] mb-3">{job.company} • {job.location}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-full border border-green-200">
                    {job.type}
                  </span>
                  {job.categories.map((cat) => {
                    const s = getCategoryStyle(cat);
                    return (
                      <span key={cat} className={`px-3 py-1 ${s.bg} ${s.text} text-xs font-medium rounded-full border ${s.border}`}>
                        {cat}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
            {alreadyApplied ? (
              <button disabled
                className="flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 px-8 py-3 rounded-sm text-sm font-semibold cursor-default whitespace-nowrap">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Applied
              </button>
            ) : (
              <button onClick={handleApplyClick}
                className="bg-[#4640DE] text-white px-8 py-3 rounded-sm text-sm font-semibold hover:bg-[#3730A3] transition-colors whitespace-nowrap">
                Apply Now
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-[#25324B] mb-6">Job Description</h2>
              <div className="prose prose-sm max-w-none text-[#515B6F]">
                {job.fullDescription.split('\n').map((p, i) => {
                  if (p.startsWith('**') && p.endsWith('**'))
                    return <h3 key={i} className="text-lg font-semibold text-[#25324B] mt-6 mb-3">{p.replace(/\*\*/g, '')}</h3>;
                  if (p.startsWith('- '))
                    return <li key={i} className="ml-4 mb-2">{p.replace('- ', '')}</li>;
                  if (p.trim()) return <p key={i} className="mb-4">{p}</p>;
                  return null;
                })}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-8">
              <h3 className="text-lg font-bold text-[#25324B] mb-4">Job Overview</h3>
              <div className="space-y-4">
                {[
                  { label: 'Job Type', value: job.type },
                  { label: 'Location', value: job.location },
                  { label: 'Salary', value: job.salary },
                  { label: 'Company', value: job.company },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#f8f8fd] rounded-lg flex items-center justify-center shrink-0">
                      <div className="w-3 h-3 bg-[#4640DE] rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-sm text-[#515B6F]">{label}</p>
                      <p className="font-medium text-[#25324B]">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
              {alreadyApplied ? (
                <button disabled
                  className="w-full mt-6 flex items-center justify-center gap-2 bg-green-50 text-green-700 border border-green-200 py-3 rounded-sm text-sm font-semibold cursor-default">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Applied
                </button>
              ) : (
                <button onClick={handleApplyClick}
                  className="w-full mt-6 bg-[#4640DE] text-white py-3 rounded-sm text-sm font-semibold hover:bg-[#3730A3] transition-colors">
                  Apply Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#25324B]">Apply for {job.title}</h2>
                <button onClick={() => setShowApplyForm(false)} className="text-gray-400 hover:text-gray-600">
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
                  {[
                    { label: 'Email Address', name: 'email', type: 'email', placeholder: 'Enter your email' },
                    { label: 'Resume Link (URL)', name: 'resumeLink', type: 'url', placeholder: 'https://drive.google.com/your-resume' },
                  ].map(({ label, name, type, placeholder }) => (
                    <div key={name}>
                      <label className="block text-sm font-medium text-[#25324B] mb-1">{label} *</label>
                      <input type={type} name={name} value={formData[name]}
                        onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
                        required placeholder={placeholder}
                        className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:border-[#4640DE] text-sm"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-sm font-medium text-[#25324B] mb-1">Cover Note *</label>
                    <textarea name="coverNote" value={formData.coverNote} required rows={4}
                      onChange={(e) => setFormData({ ...formData, coverNote: e.target.value })}
                      placeholder="Tell us why you're a great fit..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:border-[#4640DE] text-sm resize-none"
                    />
                  </div>

                  {applyError && (
                    <div className="bg-red-50 border border-red-200 rounded-sm px-4 py-3">
                      <p className="text-red-600 text-sm">{applyError}</p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setShowApplyForm(false)}
                      className="flex-1 px-4 py-3 border border-gray-200 text-[#515B6F] rounded-sm text-sm font-medium hover:bg-gray-50 transition-colors">
                      Cancel
                    </button>
                    <button type="submit" disabled={submitting}
                      className="flex-1 px-4 py-3 bg-[#4640DE] text-white rounded-sm text-sm font-semibold hover:bg-[#3730A3] transition-colors disabled:opacity-60">
                      {submitting ? 'Submitting...' : 'Submit Application'}
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