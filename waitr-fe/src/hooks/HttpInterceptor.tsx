import axios from "axios";

export const createInterceptor = () => {
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("waitr_token");

      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );
};
