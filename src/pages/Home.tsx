import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="max-w-lg mx-auto mt-16 p-8 bg-white shadow-lg rounded-2xl border border-gray-100">
      <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-4">
        Saylani Connect
      </h1>
      <p className="text-center text-gray-600 text-sm mb-6">
        Appointment & Request System
      </p>
      <p className="text-center text-blue-600 font-medium mb-6">
        Serving Humanity with Compassion and Integrity
      </p>
      <h2 className="text-xl font-semibold text-center text-gray-700 mb-6">
        Welcome, {user?.name || "User"}!
      </h2>

      <div className="flex flex-col gap-4">
        <button
          className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          onClick={() => navigate('/book-appointment')}
        >
          📅 Book Appointment
        </button>
        <button
          className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
          onClick={() => navigate('/request-help')}
        >
          🤝 Request Help
        </button>
        <button
          className="w-full py-3 px-4 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition"
          onClick={() => navigate('/my-requests')}
        >
          📄 My Requests
        </button>
        <button
          className="w-full py-3 px-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
          onClick={() => navigate('/profile')}
        >
          👤 Profile
        </button>
        
      </div>
    </div>
  );
};

export default Home;
