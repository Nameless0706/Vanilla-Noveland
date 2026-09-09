import { axiosInstance } from "@/config/axios";

export const getNovels = async (params = {}) => {
  const response = await axiosInstance.get("/novels", { params });
  return response.data;
};

export const getNovelById = async (id) => {
  const response = await axiosInstance.get(`/novels/${id}`);
  return response.data;
};

export const searchExternalBooks = async (query, source = "all") => {
  const response = await axiosInstance.get("/novels/search/external", {
    params: { q: query, source },
  });
  return response.data;
};

export const importExternalBook = async (bookData) => {
  const response = await axiosInstance.post("/novels/import-external", bookData);
  return response.data;
};
