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
    // Attach token
    // const token = localStorage.getItem("accessToken");
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    console.log("Request:", config.baseURL + config.url);
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,

  (error) => {
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
