import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const HelpRequestManagement: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const snap = await getDocs(collection(db, 'helpRequests'));
      setRequests(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchRequests();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, 'helpRequests', id), { status });
    setRequests(prev =>
      prev.map(req => (req.id === id ? { ...req, status } : req))
    );
  };

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4">Help Requests</h2>
      <table className="w-full border text-left text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Name</th>
            <th className="p-2">Phone</th>
            <th className="p-2">Type</th>
            <th className="p-2">Description</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(req => (
            <tr key={req.id} className="border-t">
              <td className="p-2">{req.name}</td>
              <td className="p-2">{req.phone}</td>
              <td className="p-2">{req.type}</td>
              <td className="p-2">{req.description}</td>
              <td className="p-2">{req.status}</td>
              <td className="p-2 space-x-2">
                <button onClick={() => updateStatus(req.id, 'Approved')} className="text-green-600">Approve</button>
                <button onClick={() => updateStatus(req.id, 'Rejected')} className="text-red-600">Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HelpRequestManagement;
