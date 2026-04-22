import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const getBudgets = (month) => {
  return API.get(`/budgets?month=${month}`);
};

export const setBudget = (data) => {
  return API.post("/budgets", data);
};
