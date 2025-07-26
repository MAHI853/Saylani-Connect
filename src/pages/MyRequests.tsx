import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface Appointment {
  id: string;
  name: string;
  phone: string;
  reason: string;
  preferredDate: string;
  preferredTime: string;
  status: string;
}

interface HelpRequest {
  id: string;
  name: string;
  phone: string;
  type: string;
  description: string;
  status: string;
}

const MyRequests: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      try {
        const appointmentQuery = query(
          collection(db, 'appointments'),
          where('userId', '==', user.id)
        );
        const helpQuery = query(
          collection(db, 'helpRequests'),
          where('userId', '==', user.id)
        );

        const [appointmentsSnap, helpSnap] = await Promise.all([
          getDocs(appointmentQuery),
          getDocs(helpQuery),
        ]);

        const appointmentsData: Appointment[] = appointmentsSnap.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Appointment, 'id'>),
        }));

        const helpData: HelpRequest[] = helpSnap.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<HelpRequest, 'id'>),
        }));

        setAppointments(appointmentsData);
        setHelpRequests(helpData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">My Requests</h2>

      {/* Appointments Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-blue-700">Appointments</h3>
        {appointments.length === 0 ? (
          <p className="text-gray-600">No appointments found.</p>
        ) : (
          <ul className="space-y-4">
            {appointments.map(app => (
              <li key={app.id} className="border p-4 rounded-lg shadow-sm">
                <p><strong>Reason:</strong> {app.reason}</p>
                <p><strong>Date:</strong> {app.preferredDate}</p>
                <p><strong>Time:</strong> {app.preferredTime}</p>
                <p><strong>Status:</strong>
                  <span className={`ml-1 font-semibold ${
                    app.status === 'Pending' ? 'text-yellow-600' :
                    app.status === 'Approved' ? 'text-green-600' :
                    'text-red-600'
                  }`}>
                    {app.status}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Help Requests Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-green-700">Help Requests</h3>
        {helpRequests.length === 0 ? (
          <p className="text-gray-600">No help requests found.</p>
        ) : (
          <ul className="space-y-4">
            {helpRequests.map(req => (
              <li key={req.id} className="border p-4 rounded-lg shadow-sm">
                <p><strong>Type:</strong> {req.type}</p>
                <p><strong>Description:</strong> {req.description}</p>
                <p><strong>Status:</strong>
                  <span className={`ml-1 font-semibold ${
                    req.status === 'Pending' ? 'text-yellow-600' :
                    req.status === 'Approved' ? 'text-green-600' :
                    'text-red-600'
                  }`}>
                    {req.status}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyRequests;
