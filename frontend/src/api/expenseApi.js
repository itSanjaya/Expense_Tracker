import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Get all expenses
export const getExpenses = () => api.get('/expenses');

// Create an expense
export const createExpense = (data) => api.post('/expenses', data);

// Delete an expense
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);