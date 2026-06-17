import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar, ProtectedRoute } from './components';
import { 
  HomePage, 
  LoginPage, 
  SignupPage, 
  DashboardPage, 
  ProfilePage, 
  NotFoundPage 
} from './pages';

function App() {
  return (
    <div className="min-h-screen bg-background text-text transition-colors duration-200">
      <Navbar />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
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
