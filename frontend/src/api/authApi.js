import { axiosInstance } from "@config/axios";

export const login = async (email, password, rememberMe = false) => {
  const response = await axiosInstance.post("/auth/login", {
    email,
    password,
    rememberMe,
  });
  return response.data;
};

export const register = async (display_name, email, password) => {
  const response = await axiosInstance.post("/auth/register", {
    display_name,
    email,
    password,
  });
  return response.data;
};

export const sendVerifyOtp = async (email) => {
  const response = await axiosInstance.post("/auth/send-otp", {
    email,
  });
  return response.data;
};

export const verifyOtp = async (email, otp) => {
  const response = await axiosInstance.post("/auth/verify", {
    email,
    otp,
  });
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await axiosInstance.post("/auth/forgot-password", {
    email,
  });
  return response.data;
};

export const resetPassword = async (token, password) => {
  const response = await axiosInstance.post(`/auth/reset-password/${token}`, {
    password,
  });
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};
