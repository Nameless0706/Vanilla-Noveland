import { axiosInstance } from "@config/axios";

export const getProfile = async () => {
  const response = await axiosInstance.get("/profile/me");
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await axiosInstance.put("/profile/me", data);
  return response.data;
};

export const changePassword = async ({ currentPassword, newPassword }) => {
  const response = await axiosInstance.put("/profile/change-password", {
    currentPassword,
    newPassword,
  });
  return response.data;
};

export const getMyThreads = async () => {
  const response = await axiosInstance.get("/profile/threads");
  return response.data;
};

export const getMyComments = async () => {
  const response = await axiosInstance.get("/profile/comments");
  return response.data;
};

export const getPublicProfile = async (userId) => {
  const response = await axiosInstance.get(`/profile/user/${userId}`);
  return response.data;
};

export const getUserThreads = async (userId) => {
  const response = await axiosInstance.get(`/profile/user/${userId}/threads`);
  return response.data;
};
