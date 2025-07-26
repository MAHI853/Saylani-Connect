import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { JobProvider } from './context/JobContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import JobDetail from './pages/JobDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Applications from './pages/Applications';
import AdminDashboard from './pages/admin/AdminDashboard';
import BookAppointment from './pages/BookAppoinment';
import MyRequests from './pages/MyRequests';
import RequestHelp from './pages/RequestHelp';
import UserProfile from './pages/UserProfile';

function App() {
  return (
    <AuthProvider>
      <JobProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/jobs/:id" element={<JobDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/applications" element={<Applications />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/book-appointment" element={<BookAppointment />} />
              <Route path="/my-requests" element={<MyRequests />} />
              <Route path="/request-help" element={<RequestHelp />} />
              <Route path="/profile" element={<UserProfile />} />
              
            </Routes>
          </Layout>
        </Router>
      </JobProvider>
    </AuthProvider>
  );
}

export default App;