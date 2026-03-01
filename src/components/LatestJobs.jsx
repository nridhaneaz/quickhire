import { Link } from 'react-router-dom';
import { useJobs } from '../context/JobContext';
import JobCard from './JobCard';

export default function LatestJobs() {
  const { getFilteredJobs } = useJobs();
  const jobs = getFilteredJobs().slice(0, 10);

  return (
    <section id="browse-companies" className="py-16 bg-[#f8f8fd]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#25324B]">
            Latest <span className="text-[#26A4FF]">jobs open</span>
          </h2>
          <Link to="/jobs" className="text-[#4640DE] text-sm font-semibold flex items-center gap-2 hover:underline">
            Show all jobs
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#515B6F] text-lg">No jobs found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} variant="list" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
