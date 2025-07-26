import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Button12 from '../Elements/Button';

const RequestHelp: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [helpType, setHelpType] = useState('Food');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');

    try {
      await addDoc(collection(db, 'helpRequests'), {
        userId: user?.id,
        name: user?.name,
        phone: user?.phone,
        type: helpType,
        description,
        status: 'Pending',
        createdAt: Timestamp.now(),
      });

      setSuccess('Help request submitted successfully!');
      setHelpType('Food');
      setDescription('');
      setTimeout(() => navigate('/my-requests'), 1200);
    } catch (error) {
      console.error('Error submitting help request:', error);
      setSuccess('Failed to submit help request.');
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Request Help</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          value={user?.name || ''}
          disabled
          className="border border-gray-300 rounded px-3 py-2 bg-gray-100 text-gray-700"
          placeholder="Name"
        />
        <input
          type="text"
          value={user?.phone || ''}
          disabled
          className="border border-gray-300 rounded px-3 py-2 bg-gray-100 text-gray-700"
          placeholder="Phone Number"
        />

        <select
          value={helpType}
          onChange={e => setHelpType(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 bg-gray-100 text-gray-700"
          required
        >
          <option value="Food">Food</option>
          <option value="Health">Health</option>
          <option value="Education">Education</option>
          <option value="Other">Other</option>
        </select>

        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 bg-gray-100 text-gray-700"
          placeholder="Describe your situation..."
          rows={4}
          required
        />

        <button type="submit" disabled={loading} style={{ all: 'unset', cursor: loading ? 'not-allowed' : 'pointer' }}
>           <Button12 />
        </button>

 


        {/* <button
          type="submit"
          className="btn-primary"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button> */}

        {success && <div className="text-center text-green-600">{success}</div>}
      </form>
    </div>
  );
};

export default RequestHelp;
