import { useState } from 'react';
import { useJobs } from '../context/JobContext';
import JobCard from '../components/JobCard';

export default function AllJobs() {
  const { 
    getFilteredJobs, 
    searchTerm, 
    setSearchTerm, 
    selectedLocation, 
    setSelectedLocation, 
    selectedCategory, 
    setSelectedCategory,
    locations,
    categories,
    jobsLoading 
  } = useJobs();

  const [jobType, setJobType] = useState('');
  
  const jobs = getFilteredJobs();
  
  // Further filter by job type if selected
  const filteredJobs = jobType 
    ? jobs.filter(job => job.type === jobType)
    : jobs;

  const jobTypes = ['Full Time', 'Part Time', 'Remote', 'Contract', 'Internship'];

  if (jobsLoading) {
    return (
      <div className="min-h-screen bg-[#f8f8fd] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4640DE]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8fd]">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#25324B] mb-4">
            Find your <span className="text-[#26A4FF]">dream job</span>
          </h1>
          <p className="text-[#515B6F] text-lg mb-8">
            Explore {filteredJobs.length} available job{filteredJobs.length !== 1 ? 's' : ''} across various categories
          </p>

          {/* Search Bar */}
          <div className="bg-white border border-gray-200 rounded-md p-2 shadow-sm">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center gap-2 px-4 py-2">
                <svg className="w-5 h-5 text-[#A8ADB7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Job title or keyword"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full outline-none text-[#25324B] placeholder-[#A8ADB7]"
                />
              </div>
              <div className="flex-1 flex items-center gap-2 px-4 py-2 border-t md:border-t-0 md:border-l border-gray-200">
                <svg className="w-5 h-5 text-[#A8ADB7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full outline-none text-[#25324B] bg-transparent cursor-pointer"
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
              <button className="bg-[#4640DE] text-white px-8 py-3 rounded-sm font-semibold hover:bg-[#3730A3] transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
              <h3 className="font-bold text-[#25324B] mb-4">Filters</h3>

              {/* Job Type Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-[#25324B] text-sm mb-3">Job Type</h4>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="jobType"
                      value=""
                      checked={jobType === ''}
                      onChange={(e) => setJobType(e.target.value)}
                      className="w-4 h-4 text-[#4640DE] focus:ring-[#4640DE]"
                    />
                    <span className="ml-2 text-sm text-[#515B6F]">All Types</span>
                  </label>
                  {jobTypes.map((type) => (
                    <label key={type} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="jobType"
                        value={type}
                        checked={jobType === type}
                        onChange={(e) => setJobType(e.target.value)}
                        className="w-4 h-4 text-[#4640DE] focus:ring-[#4640DE]"
                      />
                      <span className="ml-2 text-sm text-[#515B6F]">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <h4 className="font-semibold text-[#25324B] text-sm mb-3">Categories</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={selectedCategory === ''}
                      onChange={() => setSelectedCategory('')}
                      className="w-4 h-4 text-[#4640DE] focus:ring-[#4640DE]"
                    />
                    <span className="ml-2 text-sm text-[#515B6F]">All Categories</span>
                  </label>
                  {categories.filter(c => c.isActive !== false).map((cat) => (
                    <label key={cat.id} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={cat.name}
                        checked={selectedCategory === cat.name}
                        onChange={() => setSelectedCategory(cat.name)}
                        className="w-4 h-4 text-[#4640DE] focus:ring-[#4640DE]"
                      />
                      <span className="ml-2 text-sm text-[#515B6F]">{cat.name}</span>
                      <span className="ml-auto text-xs text-[#A8ADB7]">{cat.jobs}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {(searchTerm || selectedLocation !== 'All Locations' || selectedCategory || jobType) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedLocation('All Locations');
                    setSelectedCategory('');
                    setJobType('');
                  }}
                  className="w-full mt-6 px-4 py-2 text-sm text-[#4640DE] border border-[#4640DE] rounded-sm hover:bg-[#4640DE] hover:text-white transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </aside>

          {/* Jobs Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#25324B]">
                {filteredJobs.length} Job{filteredJobs.length !== 1 ? 's' : ''} Found
              </h2>
              <select className="px-4 py-2 border border-gray-200 rounded-sm text-sm text-[#515B6F] outline-none focus:border-[#4640DE]">
                <option>Most Recent</option>
                <option>Oldest First</option>
                <option>A-Z</option>
                <option>Z-A</option>
              </select>
            </div>

            {filteredJobs.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <svg className="w-16 h-16 mx-auto text-[#A8ADB7] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-[#25324B] mb-2">No jobs found</h3>
                <p className="text-[#515B6F] mb-4">Try adjusting your search or filters to find what you're looking for.</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedLocation('All Locations');
                    setSelectedCategory('');
                    setJobType('');
                  }}
                  className="px-6 py-2 bg-[#4640DE] text-white rounded-sm hover:bg-[#3730A3] transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} variant="list" />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
