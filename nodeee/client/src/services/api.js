import axios from 'axios';

function resolveBaseURL() {
  const fromEnv = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '');
  if (fromEnv) return `${fromEnv}/api`;
  if (import.meta.env.DEV) return '/api';
  return '/api';
}

export const api = axios.create({
  baseURL: resolveBaseURL(),
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('coursehub_auth');
  if (raw) {
    try {
      const { token } = JSON.parse(raw);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      /* ignore */
    }
  }
  return config;
});
