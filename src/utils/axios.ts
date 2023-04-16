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

axiosInstance.interceptors.response.use(
    function (response) {
      return response;
    },
    function (er) {
      if (axios.isAxiosError(er)) {
        if (er.response) {
          if (er.response.status == 401) {
            localStorage.removeItem("ngon:token");
            window.location.href = "/login" // <-- navigate
          }
        }
      }

      return Promise.reject(er);
    }
);
