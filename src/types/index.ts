export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  // password: string; // Added for authentication
  role: "job seeker" | "admin";
  profile: string;
  skills: string[];
  createdAt: Date;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  type: 'Job' | 'Internship';
  category: string;
  location: string;
  deadline: Date;
  status: 'Active' | 'Inactive';
  createdAt: Date;
  applications: Application[];
}

export interface Application {
  id: string;
  applicantId: string;
  applicant: User;
  jobId: string;
  job: Job;
  resumeUrl: string;
  coverLetter: string;
  status: 'Submitted' | 'Reviewed' | 'Accepted' | 'Rejected';
  appliedAt: Date;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (userData: {
    name: string;
    email: string;
    phone: string; 
    password: string;
    role: "job seeker" | "admin";
    profile?: string;
    skills?: string[];
  }) => Promise<boolean>;
}

export interface JobContextType {
  jobs: Job[];
  applications: Application[];
  addJob: (job: Omit<Job, 'id' | 'createdAt' | 'applications'>) => void;
  updateJob: (id: string, job: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  applyToJob: (jobId: string, application: Omit<Application, 'id' | 'appliedAt' | 'job' | 'applicant'>) => void;
  updateApplicationStatus: (id: string, status: Application['status']) => void;
}