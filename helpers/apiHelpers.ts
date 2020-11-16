import axios from 'axios';
import { createTokenProvider } from './authHelpers';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE;

const axiosInstance = axios.create({
  baseURL: baseUrl,
});

const addTokenToHeaders = async () => {
  const tokenProvider = createTokenProvider();
  const token = await tokenProvider.getToken();
  axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
}

const getAccessRefreshToken = (refreshToken: string): Promise<any> => {
  return axiosInstance.post('/auth/refresh-token', {
    refresh_token: refreshToken
  });
}

const login = (data): Promise<any> => {
  return axiosInstance.post('/auth/login', data);
}

const register = (data): Promise<any> => {
  const { firstName, lastName, email, password } = data;
  return axiosInstance.post('/auth/register', {
    first_name: firstName,
    last_name: lastName,
    email,
    password,
  });
}

const addPost = async (data) => {
  await addTokenToHeaders();
  return axiosInstance.post('/posts', { ...data });
}

const getPosts = () => {
  return axiosInstance.get('/posts');
}

const getPost = (postId) => {
  return axiosInstance.get(`/posts/${postId}`);
}

const deletePost = async (postId) => {
  await addTokenToHeaders();
  return axiosInstance.delete(`/posts/${postId}`);
}

const fetchUser = async (userId) => {
  await addTokenToHeaders();
  return axiosInstance.get(`/auth/user/${userId}`);
}

const updatePost = async (data) => {
  await addTokenToHeaders();
  return axiosInstance.patch(`/posts/${data.id}`, { ...data })
}

const vote = async (data) => {
  await addTokenToHeaders();
  return axiosInstance.post('/vote', data);
}

const updateUser = async (data) => {
  await addTokenToHeaders();
  return axiosInstance.patch(`/auth/user/${data.id}`, { ...data })
}

const resetPassord = (data) => {
  return axiosInstance.patch(`/reset-password`, { ...data })
}

const fetcher = url => axiosInstance.get(url).then(res => res.data);

export default {
  vote,
  login,
  fetcher,
  addPost,
  getPost,
  register,
  getPosts,
  fetchUser,
  deletePost,
  updatePost,
  updateUser,
  resetPassord,
  getAccessRefreshToken,
}
