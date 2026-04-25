<<<<<<< HEAD
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
=======
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
>>>>>>> 8617770219ddeda56b91826bb0aec50e60091f25
