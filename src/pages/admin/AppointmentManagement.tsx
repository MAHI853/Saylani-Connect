import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const AppointmentManagement: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const snap = await getDocs(collection(db, 'appointments'));
      setAppointments(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchAppointments();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, 'appointments', id), { status });
    setAppointments(prev =>
      prev.map(app => (app.id === id ? { ...app, status } : app))
    );
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Appointments</h2>
      <table className="w-full border text-left text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Name</th>
            <th className="p-2">Phone</th>
            <th className="p-2">Reason</th>
            <th className="p-2">Date</th>
            <th className="p-2">Time</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(app => (
            <tr key={app.id} className="border-t">
              <td className="p-2">{app.name}</td>
              <td className="p-2">{app.phone}</td>
              <td className="p-2">{app.reason}</td>
              <td className="p-2">{app.preferredDate}</td>
              <td className="p-2">{app.preferredTime}</td>
              <td className="p-2">{app.status}</td>
              <td className="p-2 space-x-2">
                <button onClick={() => updateStatus(app.id, 'Approved')} className="text-green-600">Approve</button>
                <button onClick={() => updateStatus(app.id, 'Rejected')} className="text-red-600">Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentManagement;
