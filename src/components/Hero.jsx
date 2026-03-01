import { useNavigate } from 'react-router-dom';
import { useJobs } from '../context/JobContext';

export default function Hero() {
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm, selectedLocation, setSelectedLocation, locations } = useJobs();

  const handleSearch = () => {
    navigate('/jobs');
  };

  return (
    <section className="bg-white py-12 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#25324B] leading-tight">
              Discover<br />
              more than<br />
              <span className="relative inline-block text-[#26A4FF]">
                5000+ Jobs
                <svg className="absolute -bottom-3 left-0 w-full" viewBox="0 0 340 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 10C40 8 120 4 200 6C260 7 310 5 338 8" stroke="#26A4FF" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M4 14C60 10 140 8 220 10C280 11 320 9 338 12" stroke="#26A4FF" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M6 18C70 14 160 12 240 13C300 14 330 13 338 15" stroke="#26A4FF" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>
            <p className="text-[#515B6F] mt-6 text-base md:text-lg max-w-md">
              Great platform for the job seeker that searching for new career heights and passionate about startups.
            </p>

            {/* Search Box */}
            <div className="mt-8 bg-white shadow-lg rounded-sm p-4 max-w-xl">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 flex items-center gap-3 border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0 md:pr-4">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Job title or keyword"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="flex-1 outline-none text-sm text-[#25324B] placeholder-gray-400"
                  />
                </div>
                <div className="flex-1 flex items-center gap-3 pb-4 md:pb-0 md:pr-4">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="flex-1 outline-none text-sm text-[#25324B] bg-transparent cursor-pointer"
                  >
                    {locations.map((location) => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
                <button onClick={handleSearch} className="bg-[#4640DE] text-white px-6 py-3 rounded-sm text-sm font-semibold hover:bg-[#3730A3] transition-colors whitespace-nowrap">
                  Search my job
                </button>
              </div>
            </div>

            {/* Popular Searches */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-[#515B6F] text-sm">Popular:</span>
              {['UI Designer', 'UX Researcher', 'Android', 'Admin'].map((tag) => (
                <button 
                  key={tag}
                  onClick={() => {
                    setSearchTerm(tag);
                    navigate('/jobs');
                  }}
                  className="text-[#515B6F] text-sm hover:text-[#4640DE] transition-colors"
                >
                  {tag},
                </button>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="hidden lg:flex justify-end">
            <div className="relative w-[500px] h-[520px]">
              
              {/* Background Pattern Image */}
              <img
                src="/images/Pattern.png"
                alt=""
                className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
                aria-hidden="true"
              />

              {/* Professional Person Image */}
              <img 
                src="/images/hero-professional.png" 
                alt="Professional"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 h-[500px] w-auto object-contain"
              />
            </div>
          </div>
        </div>

        {/* Company Logos */}
        <div className="py-8 md:py-12 border-t border-gray-100">
          <p className="text-[#515B6F] text-sm mb-6">Companies we helped grow</p>
          <div className="grid grid-cols-3 gap-y-5 gap-x-4 md:flex md:items-center md:justify-between">
            {/* Vodafone */}
            <div className="flex items-center gap-1.5">
              <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <path fillRule="evenodd" clipRule="evenodd" d="M14 2C7.373 2 2 7.373 2 14s5.373 12 12 12 12-5.373 12-12S20.627 2 14 2zm0 4a8 8 0 100 16A8 8 0 0014 6zm0 3a5 5 0 110 10A5 5 0 0114 9z" fill="#C8C8C8"/>
              </svg>
              <span className="text-[#C8C8C8] font-semibold text-sm md:text-xl tracking-wide">vodafone</span>
            </div>
            <span className="text-[#C8C8C8] font-semibold text-sm md:text-2xl italic tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>intel.</span>
            <span className="text-[#C8C8C8] font-bold text-sm md:text-2xl tracking-widest" style={{ fontFamily: 'Arial Black, sans-serif' }}>TESLA</span>
            <div className="flex items-center">
              <span className="text-[#C8C8C8] font-black text-sm md:text-2xl tracking-tight" style={{ fontFamily: 'Arial Black, sans-serif' }}>AMD</span>
              <svg width="10" height="10" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-0.5 mb-0.5 md:w-3.5 md:h-3.5">
                <path d="M0 14L7 0L14 7L7 14H0Z" fill="#C8C8C8"/>
              </svg>
            </div>
            <span className="text-[#C8C8C8] font-bold text-sm md:text-2xl" style={{ fontFamily: 'Georgia, serif' }}>Talkit</span>
          </div>
        </div>
      </div>

    </section>
  );
}