import { useJobs } from '../context/JobContext';

const categoryIcons = {
  "Design": (<svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>),
  "Sales": (<svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>),
  "Marketing": (<svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>),
  "Finance": (<svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>),
  "Technology": (<svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>),
  "Engineering": (<svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>),
  "Business": (<svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>),
  "Human Resource": (<svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>),
};

const defaultIcon = (<svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>);

export default function AllCategories() {
  const { categories, setSelectedCategory, catsLoading } = useJobs();

  const activeCategories = categories.filter((c) => c.isActive !== false);

  if (catsLoading) {
    return (
      <div className="min-h-screen bg-[#f8f8fd] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4640DE]"></div>
      </div>
    );
  }

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    // Navigate to all jobs page with category filter
    window.location.href = '/jobs';
  };

  return (
    <div className="min-h-screen bg-[#f8f8fd]">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#25324B] mb-4">
            Explore by <span className="text-[#26A4FF]">category</span>
          </h1>
          <p className="text-[#515B6F] text-lg">
            Browse jobs across {activeCategories.length} different categories
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeCategories.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-[#A8ADB7] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-xl font-semibold text-[#25324B] mb-2">No categories available</h3>
            <p className="text-[#515B6F]">Check back later for new categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activeCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.name)}
                className="bg-white border border-gray-200 rounded-lg p-8 text-left hover:border-[#4640DE] hover:shadow-lg transition-all group"
              >
                <div className="text-[#4640DE] mb-4 group-hover:scale-110 transition-transform">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-16 h-16 object-contain rounded"
                    />
                  ) : (
                    categoryIcons[category.name] || defaultIcon
                  )}
                </div>
                <h3 className="font-bold text-xl text-[#25324B] mb-2 group-hover:text-[#4640DE] transition-colors">
                  {category.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[#515B6F]">
                    {category.jobs} job{category.jobs !== 1 ? 's' : ''} available
                  </span>
                  <svg className="w-4 h-4 text-[#4640DE] opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Stats Section */}
        {activeCategories.length > 0 && (
          <div className="mt-12 bg-white rounded-lg border border-gray-200 p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-[#4640DE] mb-2">{activeCategories.length}</div>
                <div className="text-[#515B6F]">Active Categories</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#4640DE] mb-2">
                  {activeCategories.reduce((sum, cat) => sum + cat.jobs, 0)}
                </div>
                <div className="text-[#515B6F]">Total Jobs Available</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#4640DE] mb-2">
                  {Math.round(activeCategories.reduce((sum, cat) => sum + cat.jobs, 0) / activeCategories.length)}
                </div>
                <div className="text-[#515B6F]">Average Jobs per Category</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
