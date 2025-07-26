import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Briefcase,  } from 'lucide-react';
import { Job } from '../types';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const isExpired = new Date(job.deadline) < new Date();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Briefcase className="h-4 w-4" />
              <span>{job.type}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{job.location}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            job.type === 'Job' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
          }`}>
            {job.type}
          </span>
          {isExpired && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Expired
            </span>
          )}
        </div>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-3">
        {job.description}
      </p>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-1 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
        </div>
        <Link
          to={`/jobs/${job.id}`}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            isExpired
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isExpired ? 'Expired' : 'View Details'}
        </Link>
      </div>
    </div>
  );
};

export default JobCard;