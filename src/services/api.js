import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && error.response?.data?.code === 'TOKEN_EXPIRED' && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });

                const { accessToken } = response.data.data;
                localStorage.setItem('accessToken', accessToken);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed, logout user
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Auth API calls
export const authAPI = {
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    logout: async (refreshToken) => {
        const response = await api.post('/auth/logout', { refreshToken });
        return response.data;
    },

    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    updateProfile: async (updates) => {
        const response = await api.put('/auth/profile', updates);
        return response.data;
    },

    changePassword: async (passwords) => {
        const response = await api.put('/auth/change-password', passwords);
        return response.data;
    },

    forgotPassword: async (email) => {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },

    resetPassword: async (token, newPassword) => {
        const response = await api.post('/auth/reset-password', { token, newPassword });
        return response.data;
    },

    verifyEmail: async (token) => {
        const response = await api.post('/auth/verify-email', { token });
        return response.data;
    },

    verifyOTP: async (data) => {
        const response = await api.post('/auth/verify-otp', data);
        return response.data;
    },

    resendOTP: async (email) => {
        const response = await api.post('/auth/resend-otp', { email });
        return response.data;
    },

    deleteAccount: async () => {
        const response = await api.delete('/auth/account');
        return response.data;
    },
};

// Plans API calls
export const plansAPI = {
    getAll: async () => {
        const response = await api.get('/plans');
        return response.data;
    },

    create: async (planData) => {
        const response = await api.post('/plans', planData);
        return response.data; // expects { success: true, plan: ... }
    },

    delete: async (id) => {
        const response = await api.delete(`/plans/${id}`);
        return response.data;
    }
};

// Workouts API calls
export const workoutsAPI = {
    getAll: async () => {
        const response = await api.get('/workouts');
        return response.data;
    },
    create: async (session) => {
        const response = await api.post('/workouts', session);
        return response.data;
    }
};

// Feedback API calls
export const feedbackAPI = {
    submit: async (data) => {
        const response = await api.post('/feedback', data);
        return response.data;
    }
};

export default api;
