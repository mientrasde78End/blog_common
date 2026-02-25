import api from "./api";

export const getPosts = () => api.get("posts/");
export const getMyPost = () => api.get("posts/mine/");
export const createPost = (data) => api.post("posts/", data);
export const updatePost = (id, data) => api.put(`posts/${id}/`, data);
