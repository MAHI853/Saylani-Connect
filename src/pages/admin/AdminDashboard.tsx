import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import AppointmentManagement from './AppointmentManagement';
import HelpRequestManagement from './HelpRequestManagement';

const AdminDashboard: React.FC = () => {
  const [appointmentStats, setAppointmentStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
  const [helpStats, setHelpStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const appointmentSnap = await getDocs(collection(db, 'appointments'));
      const helpSnap = await getDocs(collection(db, 'helpRequests'));

      const aData = appointmentSnap.docs.map(doc => doc.data());
      const hData = helpSnap.docs.map(doc => doc.data());

      const countByStatus = (arr: any[]) => ({
        total: arr.length,
        approved: arr.filter(i => i.status === 'Approved').length,
        pending: arr.filter(i => i.status === 'Pending').length,
        rejected: arr.filter(i => i.status === 'Rejected').length
      });

      setAppointmentStats(countByStatus(aData));
      setHelpStats(countByStatus(hData));
    };

    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      {/* 📊 Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white shadow border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">📅 Appointments</h2>
          <p>Total: {appointmentStats.total}</p>
          <p className="text-green-600">Approved: {appointmentStats.approved}</p>
          <p className="text-yellow-600">Pending: {appointmentStats.pending}</p>
          <p className="text-red-600">Rejected: {appointmentStats.rejected}</p>
        </div>

        <div className="bg-white shadow border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">🎯 Help Requests</h2>
          <p>Total: {helpStats.total}</p>
          <p className="text-green-600">Approved: {helpStats.approved}</p>
          <p className="text-yellow-600">Pending: {helpStats.pending}</p>
          <p className="text-red-600">Rejected: {helpStats.rejected}</p>
        </div>
      </div>

      {/* 📋 Management Tables */}
      <AppointmentManagement />
      <HelpRequestManagement />
    </div>
  );
};

export default AdminDashboard;
