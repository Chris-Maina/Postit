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

const getPosts = () => {
  return axiosInstance.get('/posts');
}

const getPost = (postId) => {
  return axiosInstance.get(`/posts/${postId}`);
}

const fetchUser = async (userId) => {
  await addTokenToHeaders();
  return axiosInstance.get(`/auth/user/${userId}`);
}

export default {
  login,
  getPost,
  register,
  getPosts,
  fetchUser,
  getAccessRefreshToken,
}
