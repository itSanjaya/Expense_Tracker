//frontend/src/api/accountApi.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const updateAccountSettings = (data) => API.put("/account/profile", data);
export const changePassword = (data) => API.put("/account/password", data);
export const deleteAccount = (data) => API.delete("/account", { data });
export const getProfile = () => API.get("/account/profile");

