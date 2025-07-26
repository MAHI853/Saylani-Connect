import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;

      try {
        const userRef = doc(db, 'users', user.id);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setName(data.name || '');
          setPhone(data.phone || '');
          setEmail(data.email || '');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserData();
  }, [user]);

  const handleSave = async () => {
    if (!user?.id) return;
    setLoading(true);
    setSuccess('');

    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        name,
        phone,
        email,
      });
      setSuccess('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setSuccess('Failed to update profile.');
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Profile Management</h2>

      <div className="flex flex-col gap-4">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="input"
          placeholder="Name"
        />
        <input
          type="text"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className="input"
          placeholder="Phone Number"
        />
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="input"
          placeholder="Email"
        />

        <button
          onClick={handleSave}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>

        {success && <p className="text-center text-green-600">{success}</p>}
      </div>
    </div>
  );
};

export default Profile;
