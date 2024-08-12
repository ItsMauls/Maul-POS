import axios from 'axios';
import { api } from '@/constants/api';

export const login = async (credentials: { username: string, password: string }) => {
  const response = await axios.post(`${api.auth.login}`, credentials);
  return response.data;
};

export const refreshToken = async (token: string) => {
  const response = await axios.post(`${api.auth.refreshToken}`, {}, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
};

export const logout = async (token: string) => {
  await axios.post(`${api.auth.logout}`, {}, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};
