import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE;

const axiosInstance = axios.create({
  baseURL: baseUrl,
});

const addTokenToHeaders = token => {
  axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
}

const getAccessRefreshToken = (): Promise<any> => {
  return axiosInstance.get('/auth/refresh-token', { withCredentials: true });
}

const login = (data): Promise<any> => {
  return axiosInstance.post('/auth/login', data, { withCredentials: true });
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
  addTokenToHeaders(data.token);
  delete data.token;
  return axiosInstance.post('/posts', { ...data });
}

const getPosts = () => {
  return axiosInstance.get('/posts');
}

const getPost = (postId) => {
  return axiosInstance.get(`/posts/${postId}`);
}

const deletePost = async ({ postId, token }) => {
  addTokenToHeaders(token);
  return axiosInstance.delete(`/posts/${postId}`);
}

const fetchUser = async ({ userId, token }) => {
  addTokenToHeaders(token);
  return axiosInstance.get(`/auth/user/${userId}`);
}

const updatePost = async (data) => {
  addTokenToHeaders(data.token);
  delete data.token;
  return axiosInstance.patch(`/posts/${data.id}`, { ...data })
}

const vote = async (data) => {
  addTokenToHeaders(data.token);
  delete data.token;
  return axiosInstance.post('/vote', data);
}

const updateUser = async (data) => {
  addTokenToHeaders(data.token);
  delete data.token;
  return axiosInstance.patch(`/auth/user/${data.id}`, { ...data })
}

const resetPassord = (data) => {
  return axiosInstance.patch(`/reset-password`, { ...data })
}

const getUsers = () => {
  return axiosInstance.get(`/auth/users`);
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
  getUsers,
  fetchUser,
  deletePost,
  updatePost,
  updateUser,
  resetPassord,
  getAccessRefreshToken,
}
