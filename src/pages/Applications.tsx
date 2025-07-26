import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Applications: React.FC = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'job seeker') {
    return <Navigate to="/" replace />;
  }


  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
        <p className="text-gray-600">
          Track the status of your job applications
        </p>
      </div>
    </div>
  );
};

export default Applications;