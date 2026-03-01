import { Link } from 'react-router-dom';

const categoryColors = {
  "Marketing": { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200" },
  "Design": { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
  "Business": { bg: "bg-green-50", text: "text-green-600", border: "border-green-200" },
  "Technology": { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" },
  "default": { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200" }
};

export default function JobCard({ job, variant = "grid" }) {
  const getCategoryStyle = (category) => {
    return categoryColors[category] || categoryColors.default;
  };

  if (variant === "list") {
    return (
      <Link to={`/job/${job.id}`} className="block">
        <div className="bg-white border border-gray-200 rounded-sm p-4 hover:border-[#4640DE] transition-colors">
          <div className="flex items-start gap-4">
            {job.companyLogo ? (
              <img src={job.companyLogo} alt={job.company}
                className="w-12 h-12 rounded-lg object-contain border border-gray-100 shrink-0" />
            ) : (
              <div className={`w-12 h-12 ${job.logoColor} rounded-lg flex items-center justify-center text-white font-bold text-lg shrink-0`}>
                {job.logo}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[#25324B] mb-1">{job.title}</h3>
              <p className="text-sm text-[#515B6F] mb-3">
                {job.company} • {job.location}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-full border border-green-200">
                  {job.type}
                </span>
                {job.categories.slice(0, 2).map((category) => {
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
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/job/${job.id}`} className="block">
      <div className="bg-white border border-gray-200 rounded-sm p-6 hover:border-[#4640DE] transition-colors h-full">
        <div className="flex items-start justify-between mb-4">
          {job.companyLogo ? (
            <img src={job.companyLogo} alt={job.company}
              className="w-12 h-12 rounded-lg object-contain border border-gray-100" />
          ) : (
            <div className={`w-12 h-12 ${job.logoColor} rounded-lg flex items-center justify-center text-white font-bold text-lg`}>
              {job.logo}
            </div>
          )}
          <span className="px-3 py-1 border border-[#4640DE] text-[#4640DE] text-xs font-medium rounded-full">
            {job.type}
          </span>
        </div>
        <h3 className="font-semibold text-[#25324B] text-lg mb-1">{job.title}</h3>
        <p className="text-sm text-[#515B6F] mb-3">
          {job.company} • {job.location}
        </p>
        <p className="text-sm text-[#515B6F] mb-4 line-clamp-2">
          {job.description}
        </p>
        <div className="flex flex-wrap gap-2">
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
    </Link>
  );
}
