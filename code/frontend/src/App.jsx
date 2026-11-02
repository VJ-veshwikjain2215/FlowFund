import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import Onboarding from './pages/Onboarding';
import Landing from './pages/Landing';

import Transactions from './pages/Transactions';
import Planner from './pages/Planner';
import VacationPlanner from './pages/VacationPlanner';

import HealthScore from './pages/HealthScore';
import PageWrapper from './components/layout/PageWrapper';

const ProtectedRoute = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  if (!token) return <Navigate to="/auth" />;
  return children;
};

function App() {
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const [bootstrapping, setBootstrapping] = React.useState(!!token && !user);

  React.useEffect(() => {
    if (token && !user) {
      fetchMe().finally(() => setBootstrapping(false));
    } else {
      setBootstrapping(false);
    }
  }, [token, user, fetchMe]);

  if (bootstrapping) {
    return (
      <div className="h-screen w-full bg-[#0b0b12] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-2xl animate-pulse" style={{ background: 'linear-gradient(135deg, #F472B6 0%, #A78BFA 100%)' }}>
          <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
        </div>
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 animate-pulse">
           Restoring Session
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        
        {/* Protected Financial OS Routes */}
        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><PageWrapper><Dashboard /></PageWrapper></ProtectedRoute>} />

        <Route path="/transactions" element={<ProtectedRoute><PageWrapper><Transactions /></PageWrapper></ProtectedRoute>} />
        <Route path="/planner" element={<ProtectedRoute><PageWrapper><Planner /></PageWrapper></ProtectedRoute>} />
        <Route path="/vacation" element={<ProtectedRoute><PageWrapper><VacationPlanner /></PageWrapper></ProtectedRoute>} />

        <Route path="/health" element={<ProtectedRoute><PageWrapper><HealthScore /></PageWrapper></ProtectedRoute>} />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
