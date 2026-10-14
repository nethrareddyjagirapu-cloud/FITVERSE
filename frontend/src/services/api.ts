import axios from 'axios';
import {
  UserProfile,
  FoodItem,
  LoggedMealItem,
  Exercise,
  WorkoutSession,
  FitnessJourney,
  ProgressMeasurement,
} from '../types';

const rawApiUrl =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() ||
  (import.meta.env.VITE_API_URL as string | undefined)?.trim() ||
  'http://localhost:8080/api';

const sanitizedApiUrl = rawApiUrl.replace(/\/+$/, '');
export const API_BASE_URL = sanitizedApiUrl.endsWith('/api')
  ? sanitizedApiUrl
  : `${sanitizedApiUrl}/api`;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fitverse_jwt_token');
    if (token && !token.startsWith('demo_')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const currentToken = localStorage.getItem('fitverse_jwt_token');
      if (
        currentToken &&
        !currentToken.startsWith('demo_') &&
        !error.config.url.includes('/auth/login') &&
        !error.config.url.includes('/auth/register')
      ) {
        localStorage.removeItem('fitverse_jwt_token');
        localStorage.removeItem('fitverse_user');
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('fitverse_auth_logout'));
        }
      }
    }
    return Promise.reject(error);
  }
);

// === Typed API Modules ===

export const authApi = {
  login: async (email: string, password: string) => {
    const res = await apiClient.post('/auth/login', {
      email: email.trim().toLowerCase(),
      password,
    });
    return res.data;
  },
  register: async (data: { email: string; password: string; fullName: string; profile?: UserProfile }) => {
    const res = await apiClient.post('/auth/register', {
      ...data,
      email: data.email.trim().toLowerCase(),
      fullName: data.fullName.trim(),
    });
    return res.data;
  },
  getMe: async () => {
    const res = await apiClient.get<UserProfile>('/auth/me');
    return res.data;
  },
};

export const profileApi = {
  getProfile: async () => {
    const res = await apiClient.get<UserProfile>('/profile');
    return res.data;
  },
  updateProfile: async (profile: Partial<UserProfile>) => {
    const res = await apiClient.put<UserProfile>('/profile', profile);
    return res.data;
  },
};

export const nutritionApi = {
  getFoods: async (query?: string) => {
    const res = await apiClient.get<FoodItem[]>('/nutrition/foods', {
      params: query ? { query } : undefined,
    });
    return res.data;
  },
  logMeal: async (item: Partial<LoggedMealItem>) => {
    const payload = {
      foodId: item.foodId,
      foodName: item.foodName,
      mealCategory: item.mealCategory,
      logDate: item.date,
      servingOptionId: item.servingOptionId,
      servingLabel: item.servingLabel,
      quantity: item.quantity,
      totalGrams: item.totalGrams,
      calories: item.calories != null ? Math.round(item.calories) : 0,
      protein: item.protein,
      carbs: item.carbs,
      fat: item.fat,
      fibre: item.fibre,
      notes: item.notes,
    };
    const res = await apiClient.post('/nutrition/log', payload);
    const saved = res.data;
    return {
      ...saved,
      date: saved.logDate,
    } as LoggedMealItem;
  },
  getDaily: async (date?: string) => {
    const res = await apiClient.get('/nutrition/daily', {
      params: date ? { date } : undefined,
    });
    const data = res.data;
    if (data.items) {
      data.items = data.items.map((item: any) => ({
        ...item,
        date: item.logDate,
      }));
    }
    return data;
  },
  deleteMeal: async (id: string) => {
    const res = await apiClient.delete(`/nutrition/item/${id}`);
    return res.data;
  },
};

export const workoutApi = {
  getExercises: async (muscleGroup?: string) => {
    const res = await apiClient.get<Exercise[]>('/workouts/exercises', {
      params: muscleGroup && muscleGroup !== 'All' ? { muscleGroup } : undefined,
    });
    return res.data;
  },
  logSession: async (session: Partial<WorkoutSession>) => {
    const payload = {
      name: session.name,
      sessionDate: session.date || new Date().toISOString().split('T')[0],
      durationMinutes: session.durationMinutes || 45,
      totalVolumeKg: session.totalVolumeKg || 0,
      exercisesLogged: session.exercisesLogged || 1,
      notes: session.notes,
    };
    const res = await apiClient.post<any>('/workouts/session', payload);
    const saved = res.data;
    return {
      ...saved,
      date: saved.sessionDate,
      muscleGroups: session.muscleGroups || [],
    } as WorkoutSession;
  },
  getHistory: async () => {
    const res = await apiClient.get<any[]>('/workouts/history');
    return res.data.map((s) => ({
      ...s,
      date: s.sessionDate,
      muscleGroups: ['Full Body'],
    })) as WorkoutSession[];
  },
};

export const journeyApi = {
  getJourneys: async () => {
    const res = await apiClient.get<FitnessJourney[]>('/journeys');
    return res.data;
  },
  startJourney: async (journey: Partial<FitnessJourney>) => {
    const res = await apiClient.post<FitnessJourney>('/journeys', journey);
    return res.data;
  },
  updateStatus: async (id: string, status: string) => {
    const res = await apiClient.patch<FitnessJourney>(`/journeys/${id}/status`, null, {
      params: { status },
    });
    return res.data;
  },
};

export const progressApi = {
  getMeasurements: async () => {
    const res = await apiClient.get<any[]>('/progress/measurements');
    return res.data.map((m) => ({
      ...m,
      date: m.measurementDate,
    })) as ProgressMeasurement[];
  },
  logMeasurement: async (data: Partial<ProgressMeasurement>) => {
    const payload = {
      measurementDate: data.date || new Date().toISOString().split('T')[0],
      weightKg: data.weightKg,
      waistCm: data.waistCm,
      chestCm: data.chestCm,
      hipCm: data.hipCm,
      notes: data.notes,
    };
    const res = await apiClient.post<any>('/progress/measurements', payload);
    const saved = res.data;
    return {
      ...saved,
      date: saved.measurementDate,
    } as ProgressMeasurement;
  },
};

export const habitApi = {
  getHabits: async (date?: string) => {
    const res = await apiClient.get('/habits', {
      params: date ? { date } : undefined,
    });
    return res.data;
  },
  saveHabits: async (data: { logDate: string; waterIntakeMl?: number; sleepHours?: number; stepsCount?: number }) => {
    const res = await apiClient.post('/habits', data);
    return res.data;
  },
};

export const fitbotApi = {
  chat: async (query: string) => {
    const res = await apiClient.post<{ reply: string; demo: boolean; timestamp: string }>('/fitbot/chat', { query });
    return res.data;
  },
};

export const healthApi = {
  check: async () => {
    const res = await apiClient.get<{ status: string; application: string; database: { connected: boolean; engine: string } }>('/health');
    return res.data;
  },
};
