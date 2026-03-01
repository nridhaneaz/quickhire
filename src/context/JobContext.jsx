import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jobsAPI, categoriesAPI, adminJobsAPI, adminCategoriesAPI } from '../lib/api';


const JobContext = createContext();

const initialLocations = [
  'All Locations', 'Remote', 'New York, USA', 'London, UK',
  'Paris, France', 'Berlin, Germany', 'Tokyo, Japan', 'Sydney, Australia',
  'San Francisco, US', 'Madrid, Spain', 'Hamburg, Germany',
];

export function JobProvider({ children }) {
  const [jobs, setJobs]                         = useState([]);
  const [categories, setCategories]             = useState([]);
  const [locations]                             = useState(initialLocations);
  const [searchTerm, setSearchTerm]             = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [jobsLoading, setJobsLoading]           = useState(true);
  const [catsLoading, setCatsLoading]           = useState(true);

  // ── Fetch Jobs ────────────────────────────────────────────────
  const fetchJobs = useCallback(async () => {
    setJobsLoading(true);
    try {
      const data = await jobsAPI.getAll({ limit: 100 });
      // Normalize backend job → frontend shape
      const normalized = (data.data?.jobs || []).map((j) => ({
        id: j._id,
        title: j.title,
        company: j.company,
        location: j.location,
        type: j.jobType,
        categories: j.category ? [j.category.name] : [],
        description: j.about?.slice(0, 80) || '',
        fullDescription: buildFullDescription(j),
        salary: j.salary
          ? `$${j.salary.min?.toLocaleString()} - $${j.salary.max?.toLocaleString()}`
          : 'Not specified',
        logo: j.company?.charAt(0).toUpperCase() || '?',
        logoColor: pickColor(j._id),
        companyLogo: j.companyLogo || '',
        tags: j.tags || [],
        status: j.status,
      }));
      setJobs(normalized);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setJobsLoading(false);
    }
  }, []);

  // ── Fetch Categories ──────────────────────────────────────────
  const fetchCategories = useCallback(async () => {
    setCatsLoading(true);
    try {
      const data = await categoriesAPI.getAll({ limit: 100 });
      const cats = (data.data?.categories || []).map((c) => ({
        id: c._id,
        name: c.name,
        jobs: c.jobsAvailable || 0,
        image: c.image || '',
        isActive: c.isActive !== false,
      }));
      setCategories(cats);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setCatsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
    fetchCategories();
  }, [fetchJobs, fetchCategories]);

  // ── Jobs CRUD ─────────────────────────────────────────────────
  // Build FormData from job fields — shared by addJob and updateJob
  const buildJobFormData = ({ salary_min, salary_max, companyLogoFile, ...rest }) => {
    const fd = new FormData();
    if (salary_min || salary_max) {
      fd.append('salary', JSON.stringify({
        min: Number(salary_min) || 0,
        max: Number(salary_max) || 0,
      }));
    }
    if (companyLogoFile) fd.append('companyLogo', companyLogoFile);
    Object.entries(rest).forEach(([k, v]) => {
      if (Array.isArray(v)) fd.append(k, JSON.stringify(v));
      else if (v !== undefined && v !== null && v !== '') fd.append(k, v);
    });
    return fd;
  };

  const addJob = async (jobData) => {
    await adminJobsAPI.create(buildJobFormData(jobData));
    await fetchJobs();
  };

  const updateJob = async (id, jobData) => {
    await adminJobsAPI.update(id, buildJobFormData(jobData));
    await fetchJobs();
  };

  // ── Fetch single job from API (for direct URL navigation) ─────
  const getJobFromAPI = useCallback(async (id) => {
    try {
      const res = await jobsAPI.getById(id);
      const j = res.data;
      if (!j) return null;
      return {
        id: j._id,
        title: j.title,
        company: j.company,
        location: j.location,
        type: j.jobType,
        categories: j.category ? [j.category.name] : [],
        description: j.about?.slice(0, 80) || '',
        fullDescription: buildFullDescription(j),
        salary: j.salary
          ? `$${j.salary.min?.toLocaleString()} - $${j.salary.max?.toLocaleString()}`
          : 'Not specified',
        logo: j.company?.charAt(0).toUpperCase() || '?',
        logoColor: pickColor(j._id),
        companyLogo: j.companyLogo || '',
        tags: j.tags || [],
        status: j.status,
      };
    } catch {
      return null;
    }
  }, []);

  const deleteJob = async (id) => {
    await adminJobsAPI.delete(id);
    setJobs((prev) => prev.filter((j) => j.id !== id));
  };

  const toggleJobStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'ARCHIVED' : 'ACTIVE';
    const fd = new FormData();
    fd.append('status', newStatus);
    try {
      await adminJobsAPI.update(id, fd);
      setJobs((prev) =>
        prev.map((j) => j.id === id ? { ...j, status: newStatus } : j)
      );
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const getJobById = (id) => jobs.find((j) => j.id === id);

  const getFilteredJobs = () =>
    jobs.filter((job) => {
      const matchSearch =
        !searchTerm ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchLocation =
        selectedLocation === 'All Locations' || job.location === selectedLocation;
      const matchCategory =
        !selectedCategory || job.categories.includes(selectedCategory);
      return matchSearch && matchLocation && matchCategory;
    });

  // ── Categories CRUD ───────────────────────────────────────────
  const addCategory = async (name, imageFile = null) => {
    if (!name.trim()) return { success: false, error: 'Name is required' };
    const fd = new FormData();
    fd.append('name', name.trim());
    fd.append('isActive', 'true');
    if (imageFile) fd.append('image', imageFile);
    try {
      await adminCategoriesAPI.create(fd);
      await fetchCategories();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteCategory = async (id) => {
    try {
      await adminCategoriesAPI.delete(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateCategory = async (id, name, imageFile = null) => {
    if (!name.trim()) return { success: false, error: 'Name is required' };
    const fd = new FormData();
    fd.append('name', name.trim());
    if (imageFile) fd.append('image', imageFile);
    try {
      await adminCategoriesAPI.update(id, fd);
      await fetchCategories();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const toggleCategoryStatus = async (id, currentIsActive) => {
    const fd = new FormData();
    fd.append('isActive', String(!currentIsActive));
    try {
      await adminCategoriesAPI.update(id, fd);
      setCategories((prev) =>
        prev.map((c) => c.id === id ? { ...c, isActive: !currentIsActive } : c)
      );
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return (
    <JobContext.Provider value={{
      jobs, addJob, updateJob, deleteJob, toggleJobStatus, getJobById, getJobFromAPI, getFilteredJobs, fetchJobs,
      categories, addCategory, updateCategory, deleteCategory, toggleCategoryStatus, fetchCategories,
      locations,
      searchTerm, setSearchTerm,
      selectedLocation, setSelectedLocation,
      selectedCategory, setSelectedCategory,
      jobsLoading, catsLoading,
    }}>
      {children}
    </JobContext.Provider>
  );
}

export function useJobs() {
  return useContext(JobContext);
}

// ── Helpers ───────────────────────────────────────────────────────
const COLORS = [
  'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500',
  'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-red-500',
];

function pickColor(id = '') {
  const sum = [...id].reduce((a, c) => a + c.charCodeAt(0), 0);
  return COLORS[sum % COLORS.length];
}

function buildFullDescription(j) {
  let desc = j.about ? `${j.about}\n\n` : '';
  if (j.responsibilities?.length) {
    desc += `**Responsibilities**\n${j.responsibilities.map((r) => `- ${r}`).join('\n')}\n\n`;
  }
  if (j.requirements?.length) {
    desc += `**Requirements**\n${j.requirements.map((r) => `- ${r}`).join('\n')}\n\n`;
  }
  return desc || 'No description available.';
}