import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserProfile } from '../types';
import { authApi, profileApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: Partial<User> & { password: string; profile: UserProfile }) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  loginDemoUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: User = {
  id: 'usr-demo-01',
  email: 'alex.fitness@fitverse.dev',
  fullName: 'Alex Carter',
  createdAt: new Date().toISOString(),
  profile: {
    age: 26,
    gender: 'MALE',
    heightCm: 178,
    currentWeightKg: 75.5,
    fitnessGoal: 'MUSCLE_GAIN',
    activityLevel: 'MODERATELY_ACTIVE',
    fitnessExperience: 'INTERMEDIATE',
    dietPreference: 'NON_VEGETARIAN',
    workoutLocation: 'GYM',
    preferredWorkoutDays: 5,
    targetDailyCalories: 2400,
    targetDailyProtein: 150,
    targetDailyCarbs: 270,
    targetDailyFat: 65,
    targetDailyFibre: 35,
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('fitverse_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('fitverse_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('fitverse_user');
    }
  }, [user]);

  // Synchronize state if an unauthenticated 401 response occurs in the API client
  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('fitverse_auth_logout', handleLogout);
      return () => window.removeEventListener('fitverse_auth_logout', handleLogout);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail || !password) {
      throw new Error('Please provide both email and password.');
    }

    try {
      const data = await authApi.login(cleanEmail, password);
      const loggedUser: User = {
        id: data.id || data.userId || 'usr-default',
        email: data.email,
        fullName: data.fullName,
        createdAt: new Date().toISOString(),
        profile: data.profile,
      };
      setUser(loggedUser);
      localStorage.setItem('fitverse_jwt_token', data.token);
    } catch (err: any) {
      let msg = err.response?.data?.message;
      if (!msg && err.response?.data?.details) {
        msg = Object.values(err.response.data.details).join(', ');
      }
      if (!msg) {
        msg = err.response?.data?.error || err.message || 'Invalid email or password.';
      }
      throw new Error(msg);
    }
  };

  const register = async (data: Partial<User> & { password: string; profile: UserProfile }) => {
    const cleanEmail = (data.email || '').trim().toLowerCase();
    const cleanFullName = (data.fullName || '').trim();

    if (!cleanFullName) {
      throw new Error('Full name is required.');
    }
    if (!cleanEmail) {
      throw new Error('Email address is required.');
    }
    if (!data.password || data.password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    try {
      const resp = await authApi.register({
        email: cleanEmail,
        password: data.password,
        fullName: cleanFullName,
        profile: data.profile,
      });

      const newUser: User = {
        id: resp.id || resp.userId || 'usr-default',
        email: resp.email,
        fullName: resp.fullName,
        createdAt: new Date().toISOString(),
        profile: resp.profile,
      };
      setUser(newUser);
      localStorage.setItem('fitverse_jwt_token', resp.token);
    } catch (err: any) {
      let msg = err.response?.data?.message;
      if (!msg && err.response?.data?.details) {
        msg = Object.values(err.response.data.details).join(', ');
      }
      if (!msg) {
        msg = err.response?.data?.error || err.message || 'Registration failed.';
      }
      throw new Error(msg);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fitverse_user');
    localStorage.removeItem('fitverse_jwt_token');
  };

  const loginDemoUser = async () => {
    try {
      const data = await authApi.login('alex.fitness@fitverse.dev', 'password123');
      const loggedUser: User = {
        id: data.id || data.userId || 'usr-demo-01',
        email: data.email,
        fullName: data.fullName,
        createdAt: new Date().toISOString(),
        profile: data.profile || DEMO_USER.profile,
      };
      setUser(loggedUser);
      localStorage.setItem('fitverse_jwt_token', data.token);
    } catch (err: any) {
      // Local fallback in case backend is offline
      console.warn('Backend authentication offline, falling back to local demo profile:', err);
      setUser(DEMO_USER);
      localStorage.setItem('fitverse_jwt_token', 'demo_jwt_token_fitverse');
    }
  };

  const updateProfile = async (updatedProfile: Partial<UserProfile>) => {
    if (!user) return;
    try {
      const saved = await profileApi.updateProfile(updatedProfile);
      const updated: User = {
        ...user,
        profile: {
          ...user.profile!,
          ...saved,
        },
      };
      setUser(updated);
    } catch {
      // Local fallback
      const updated: User = {
        ...user,
        profile: {
          ...user.profile!,
          ...updatedProfile,
        },
      };
      setUser(updated);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
        loginDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
