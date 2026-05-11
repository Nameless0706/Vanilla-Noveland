import { axiosInstance } from "@config/axios";

export const login = async (email, password) => {
  const response = await axiosInstance.post("/auth/login", {
    email,
    password,
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

export const forgotPassword = async (email) => {
  const response = await axiosInstance.post("/auth/forgot-password", {
    email,
  });
  return response.data;
};

export const verifyOtp = async (email, otp) => {
  const response = await axiosInstance.post("/auth/verify", {
    email,
    otp,
  });

  console.log(email, otp)
  return response.data;
};
