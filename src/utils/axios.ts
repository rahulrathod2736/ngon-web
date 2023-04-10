import axios from "axios";

const version = 'v1';

export const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_NOGON_API_URL}/${version}`,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("ngon:token");
  if (token) {
    config.headers["Authorization"] = "Bearer " + token;
  }
  config.headers["Content-Type"] = "application/json";
  return config;
});
