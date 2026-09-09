import { axiosInstance } from "@/config/axios";

export const getNovels = async (params = {}) => {
  const response = await axiosInstance.get("/novels", { params });
  return response.data;
};

export const getNovelById = async (id) => {
  const response = await axiosInstance.get(`/novels/${id}`);
  return response.data;
};
