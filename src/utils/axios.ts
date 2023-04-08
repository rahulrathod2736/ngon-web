import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/v1",
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("ngon:token");
  if (token) {
    config.headers["Authorization"] = "Bearer " + token;
  }
  config.headers["Content-Type"] = "application/json";
  return config;
});
