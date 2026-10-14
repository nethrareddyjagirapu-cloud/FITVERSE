import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { DashboardPage } from './pages/DashboardPage';
import { NutritionTrackerPage } from './pages/NutritionTrackerPage';
import { WorkoutTrackerPage } from './pages/WorkoutTrackerPage';
import { GoalsPage } from './pages/GoalsPage';
import { ProgressTrackerPage } from './pages/ProgressTrackerPage';
import { JourneyPage } from './pages/JourneyPage';
import { HabitsPage } from './pages/HabitsPage';
import { FitBotPage } from './pages/FitBotPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

// Protected Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Authenticated Dashboard Routes */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="nutrition" element={<NutritionTrackerPage />} />
            <Route path="workouts" element={<WorkoutTrackerPage />} />
            <Route path="goals" element={<GoalsPage />} />
            <Route path="progress" element={<ProgressTrackerPage />} />
            <Route path="journey" element={<JourneyPage />} />
            <Route path="habits" element={<HabitsPage />} />
            <Route path="fitbot" element={<FitBotPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
