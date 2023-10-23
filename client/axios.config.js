import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`,
  withCredentials: true,
  timeout: 10000,
});

export default api;
