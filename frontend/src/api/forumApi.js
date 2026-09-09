import { axiosInstance } from "@/config/axios";

export const getForumThreads = async (params = {}) => {
  const response = await axiosInstance.get("/forum/threads", { params });
  return response.data;
};

export const getForumThreadById = async (id) => {
  const response = await axiosInstance.get(`/forum/threads/${id}`);
  return response.data;
};

export const createForumThread = async (data) => {
  const response = await axiosInstance.post("/forum/threads", data);
  return response.data;
};

export const toggleUpvoteThread = async (id) => {
  const response = await axiosInstance.post(`/forum/threads/${id}/upvote`);
  return response.data;
};

export const getThreadComments = async (threadId) => {
  const response = await axiosInstance.get(`/forum/threads/${threadId}/comments`);
  return response.data;
};

export const createThreadComment = async (threadId, data) => {
  const response = await axiosInstance.post(
    `/forum/threads/${threadId}/comments`,
    data
  );
  return response.data;
};

export const toggleLikeComment = async (commentId) => {
  const response = await axiosInstance.post(
    `/forum/comments/${commentId}/like`
  );
  return response.data;
};
