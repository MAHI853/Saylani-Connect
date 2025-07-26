import React, { createContext, useContext, useState, useEffect } from 'react';
import { Job, Application, JobContextType } from '../types';
import { useAuth } from './AuthContext';
import {
  addJobToFirebase,
  fetchJobsFromFirebase,
  updateJobInFirebase,
  deleteJobFromFirebase,
} from '../utils/jobService';

const JobContext = createContext<JobContextType | undefined>(undefined);

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const { user } = useAuth();

  // Fetch jobs from Firebase on mount and when jobs change
  const loadJobs = async () => {
    const jobsFromFirebase = await fetchJobsFromFirebase();
    setJobs(jobsFromFirebase as Job[]);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  // Add job to Firebase and update state
  const addJob = async (jobData: Omit<Job, 'id' | 'createdAt' | 'applications'>) => {
    const newJob = {
      ...jobData,
      createdAt: new Date(),
      applications: [],
    };
    await addJobToFirebase(newJob);
    await loadJobs();
  };

  // Update job in Firebase and update state
  const updateJob = async (id: string, jobData: Partial<Job>) => {
    await updateJobInFirebase(id, jobData);
    await loadJobs();
  };

  // Delete job from Firebase and update state
  const deleteJob = async (id: string) => {
    await deleteJobFromFirebase(id);
    await loadJobs();
    setApplications(prev => prev.filter(app => app.jobId !== id));
  };

  // Applications are still local; you can extend this to Firebase if needed
  const applyToJob = (jobId: string, applicationData: Omit<Application, 'id' | 'appliedAt' | 'job' | 'applicant'>) => {
    if (!user) return;

    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    const newApplication: Application = {
      ...applicationData,
      id: Date.now().toString(),
      appliedAt: new Date(),
      job,
      applicant: user,
    };

    setApplications(prev => [...prev, newApplication]);
  };

  const updateApplicationStatus = (id: string, status: Application['status']) => {
    setApplications(prev => prev.map(app =>
      app.id === id ? { ...app, status } : app
    ));
  };

  return (
    <JobContext.Provider value={{
      jobs,
      applications,
      addJob,
      updateJob,
      deleteJob,
      applyToJob,
      updateApplicationStatus,
    }}>
      {children}
    </JobContext.Provider>
  );
};