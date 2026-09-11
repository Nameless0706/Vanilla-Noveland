import axios from "axios";

const server_endpoint = import.meta.env.VITE_SERVER_ENDPOINT;

export const axiosInstance = axios.create({
  baseURL: server_endpoint,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Handle token refresh on 401 if refreshToken cookie exists and not already retried
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/")
    ) {
      originalRequest._retry = true;
      try {
        await axiosInstance.post("/auth/refresh-token");
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh token invalid or expired
        return Promise.reject({
          status: 401,
          message: "Session expired. Please log in again.",
          errors: null,
          raw: refreshError,
        });
      }
    }

    // No response = network error / server unreachable / timeout
    if (!error.response) {
      return Promise.reject({
        status: null,
        message: "Unable to connect to the server",
        errors: null,
        raw: error,
      });
    }

    const { status, data } = error.response;

    return Promise.reject({
      status,
      message: data?.message || "Something went wrong",
      isNotVerified: Boolean(data?.isNotVerified),
      email: data?.email,
      errors: data?.errors || null,
      data,
      raw: error,
    });
  },
);
