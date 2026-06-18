import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar, ProtectedRoute } from './components';
import { 
  HomePage, 
  LoginPage, 
  SignupPage, 
  DashboardPage, 
  HistoryPage,
  NotificationsPage,
  ProfilePage, 
  NotFoundPage 
} from './pages';

function App() {
  return (
    <div className="min-h-screen bg-background text-text transition-colors duration-200 relative overflow-hidden">
      {/* Premium Glow Backgrounds */}
      <div className="ambient-glow" style={{ top: '10%', left: '10%' }}></div>
      <div className="ambient-glow-2" style={{ bottom: '15%', right: '10%' }}></div>
      
      <Navbar />
      <main className="relative z-10">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Fallback 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
