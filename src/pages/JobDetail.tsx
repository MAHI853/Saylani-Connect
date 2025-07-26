import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { MapPin, Calendar, Briefcase,} from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { useAuth } from '../context/AuthContext';

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { jobs, applications, applyToJob } = useJobs();
  const { user } = useAuth();
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const job = jobs.find(j => j.id === id);
  const hasApplied = applications.some(app => app.jobId === id && app.applicantId === user?.id);
  const isExpired = job ? new Date(job.deadline) < new Date() : false;

  if (!job) {
    return <Navigate to="/" replace />;
  }

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !resumeFile) return;

    setIsSubmitting(true);
    
    // Simulate file upload - in production, this would upload to cloud storage
    const resumeUrl = `uploads/${resumeFile.name}`;
    
    applyToJob(job.id, {
      applicantId: user.id,
      jobId: job.id,
      resumeUrl,
      coverLetter,
      status: 'Submitted',
    });

    setIsSubmitting(false);
    setShowApplicationForm(false);
    setCoverLetter('');
    setResumeFile(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-8 border-b border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <div className="flex items-center space-x-6 text-gray-600">
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5" />
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                job.type === 'Job' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
              }`}>
                {job.type}
              </span>
              {isExpired && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Expired
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Category: {job.category}</span>
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-500">
              Posted: {new Date(job.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>
        </div>

        {/* Application Section */}
        <div className="px-6 py-6 bg-gray-50 border-t border-gray-200">
          {!user ? (
            <div className="text-center">
              <p className="text-gray-600 mb-4">Please log in to apply for this position.</p>
              <button
                onClick={() => window.location.href = '/login'}
                className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                Log In to Apply
              </button>
            </div>
          ) : user.role !== 'job seeker' ? (
            <div className="text-center">
              <p className="text-gray-600">Only job seekers can apply for positions.</p>
            </div>
          ) : hasApplied ? (
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 text-green-600 mb-2">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Application Submitted</span>
              </div>
              <p className="text-gray-600">You have already applied for this position.</p>
            </div>
          ) : isExpired ? (
            <div className="text-center">
              <p className="text-red-600 font-medium">This position has expired and is no longer accepting applications.</p>
            </div>
          ) : (
            <div>
              {!showApplicationForm ? (
                <div className="text-center">
                  <button
                    onClick={() => setShowApplicationForm(true)}
                    className="bg-blue-600 text-white px-8 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors text-lg"
                  >
                    Apply Now
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Submit Your Application</h3>
                  
                  <div>
                    <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-2">
                      Resume (PDF, DOC, DOCX) *
                    </label>
                    <input
                      type="file"
                      id="resume"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
                      Cover Letter
                    </label>
                    <textarea
                      id="coverLetter"
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      disabled={isSubmitting || !resumeFile}
                      className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowApplicationForm(false)}
                      className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md font-medium hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetail;