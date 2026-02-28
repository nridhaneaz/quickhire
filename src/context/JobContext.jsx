import { createContext, useContext, useState } from 'react';

// ─── Initial Data ───────────────────────────────────────────────
const initialCategories = [
  { name: "Design",         jobs: 235 },
  { name: "Sales",          jobs: 756 },
  { name: "Marketing",      jobs: 140 },
  { name: "Finance",        jobs: 325 },
  { name: "Technology",     jobs: 436 },
  { name: "Engineering",    jobs: 542 },
  { name: "Business",       jobs: 211 },
  { name: "Human Resource", jobs: 168 },
];

const initialLocations = [
  'All Locations',
  'Remote',
  'New York, USA',
  'London, UK',
  'Paris, France',
  'Berlin, Germany',
  'Tokyo, Japan',
  'Sydney, Australia',
];

const logoColors = [
  'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500',
  'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-red-500',
];

const initialJobs = [
  {
    id: '1', title: 'UI/UX Designer', company: 'Dribbble',
    location: 'Remote', type: 'Full Time',
    categories: ['Design'],
    description: 'Create beautiful user interfaces and experiences.',
    fullDescription: `**About the Role**\nWe are looking for a talented UI/UX Designer.\n\n**Responsibilities**\n- Design user interfaces\n- Create wireframes and prototypes\n- Collaborate with developers\n\n**Requirements**\n- 3+ years experience\n- Proficiency in Figma`,
    salary: '$80,000 - $120,000', logo: 'D', logoColor: 'bg-pink-500',
  },
  {
    id: '2', title: 'Software Engineer', company: 'Twitter',
    location: 'New York, USA', type: 'Full Time',
    categories: ['Technology', 'Engineering'],
    description: 'Build scalable systems and features.',
    fullDescription: `**About the Role**\nJoin our engineering team.\n\n**Responsibilities**\n- Build new features\n- Write clean code\n- Code reviews\n\n**Requirements**\n- 4+ years experience\n- React/Node.js`,
    salary: '$100,000 - $150,000', logo: 'T', logoColor: 'bg-blue-400',
  },
  {
    id: '3', title: 'Marketing Manager', company: 'Notion',
    location: 'London, UK', type: 'Full Time',
    categories: ['Marketing', 'Business'],
    description: 'Lead marketing campaigns and strategy.',
    fullDescription: `**About the Role**\nDrive our marketing efforts.\n\n**Responsibilities**\n- Develop marketing strategies\n- Manage campaigns\n- Analyze metrics\n\n**Requirements**\n- 5+ years experience`,
    salary: '$90,000 - $130,000', logo: 'N', logoColor: 'bg-gray-700',
  },
  {
    id: '4', title: 'Product Designer', company: 'Figma',
    location: 'Remote', type: 'Full Time',
    categories: ['Design'],
    description: 'Shape the future of design tools.',
    fullDescription: `**About the Role**\nHelp build the world's best design platform.\n\n**Responsibilities**\n- Product design\n- User research\n- Prototyping\n\n**Requirements**\n- 3+ years experience`,
    salary: '$110,000 - $160,000', logo: 'F', logoColor: 'bg-purple-500',
  },
];

// ─── Context ─────────────────────────────────────────────────────
const JobContext = createContext();

export function JobProvider({ children }) {
  const [jobs, setJobs]                     = useState(initialJobs);
  const [categories, setCategories]         = useState(initialCategories);
  const [locations]                         = useState(initialLocations);
  const [searchTerm, setSearchTerm]         = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedCategory, setSelectedCategory] = useState('');

  // ── Jobs ──
  const addJob = (jobData) => {
    const newJob = {
      ...jobData,
      id: Date.now().toString(),
      logo: jobData.company.charAt(0).toUpperCase(),
      logoColor: logoColors[Math.floor(Math.random() * logoColors.length)],
    };
    setJobs(prev => [newJob, ...prev]);
  };

  const deleteJob = (id) => {
    setJobs(prev => prev.filter(j => j.id !== id));
  };

  const getJobById = (id) => jobs.find(j => j.id === id);

  const getFilteredJobs = () => {
    return jobs.filter(job => {
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
  };

  // ── Categories ──
  const addCategory = (name) => {
    if (!name.trim()) return { success: false, error: 'Name is required' };
    if (categories.find(c => c.name.toLowerCase() === name.trim().toLowerCase())) {
      return { success: false, error: 'Category already exists' };
    }
    setCategories(prev => [...prev, { name: name.trim(), jobs: 0 }]);
    return { success: true };
  };

  const deleteCategory = (name) => {
    setCategories(prev => prev.filter(c => c.name !== name));
  };

  return (
    <JobContext.Provider value={{
      jobs, addJob, deleteJob, getJobById, getFilteredJobs,
      categories, addCategory, deleteCategory,
      locations,
      searchTerm, setSearchTerm,
      selectedLocation, setSelectedLocation,
      selectedCategory, setSelectedCategory,
    }}>
      {children}
    </JobContext.Provider>
  );
}

export function useJobs() {
  return useContext(JobContext);
}