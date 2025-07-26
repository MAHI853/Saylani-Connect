import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Button12 from '../Elements/Button';

const BookAppointment: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reason, setReason] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    try {
      await addDoc(collection(db, 'appointments'), {
        userId: user?.id,
        name: user?.name,
        phone: user?.phone,
        reason,
        preferredDate: date,
        preferredTime: time,
        status: 'Pending',
        createdAt: Timestamp.now(),
      });
      setSuccess('Appointment booked successfully!');
      setReason('');
      setDate('');
      setTime('');
      setTimeout(() => navigate('/my-requests'), 1200);
    } catch (err) {
      setSuccess('Failed to book appointment.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Book Appointment</h2>
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
        <input
          type="text"
          value={reason}
          onChange={e => setReason(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 bg-gray-100 text-gray-700"
          placeholder="Reason"
          required
        />
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 bg-gray-100 text-gray-700"
          required
        />
        <input
          type="time"
          value={time}
          onChange={e => setTime(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 bg-gray-100 text-gray-700"
          required
        />
        {/* <button
          type="submit"
          className="btn-primary"
          disabled={loading}
        >
          {loading ? 'Booking...' : 'Submit'}
        </button> */}

        <button type="submit" disabled={loading} style={{ all: 'unset' }}>
          <Button12 />
        </button>

        {success && <div className="text-center text-green-600">{success}</div>}
      </form>
    </div>
  );
};

export default BookAppointment;