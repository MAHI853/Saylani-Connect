import React from 'react';
import { Calendar, FileText, User } from 'lucide-react';
import { Application } from '../types';

interface ApplicationCardProps {
  application: Application;
  showJobDetails?: boolean;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, showJobDetails = false }) => {
  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'Submitted':
        return 'bg-blue-100 text-blue-800';
      case 'Reviewed':
        return 'bg-yellow-100 text-yellow-800';
      case 'Accepted':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          {showJobDetails && (
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{application.job.title}</h3>
          )}
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{application.applicant.name}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>Applied: {new Date(application.appliedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
          {application.status}
        </span>
      </div>

      {application.coverLetter && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Cover Letter</h4>
          <p className="text-sm text-gray-700 line-clamp-3">{application.coverLetter}</p>
        </div>
      )}

      {application.resumeUrl && (
        <div className="flex items-center space-x-2">
          <FileText className="h-4 w-4 text-gray-500" />
          <a
            href={application.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View Resume
          </a>
        </div>
      )}
    </div>
  );
};

export default ApplicationCard;