import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { JobProvider } from './context/JobContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <JobProvider>
        <App />
      </JobProvider>
    </AuthProvider>
  </StrictMode>
);
