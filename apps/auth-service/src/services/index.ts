import axios from 'axios';
import { USER_SERVICE_URL } from '../constants';


const userService = {
  async findUserByEmail(email: string) {
    const response = await axios.get(`${USER_SERVICE_URL}/by-email/${email}`);
    return response.data;
  },

  async validateUserCredentials(email: string, password: string) {
    const response = await axios.post(`${USER_SERVICE_URL}/validate`, { email, password });
    return response.data;
  },

  async createUser(userData: { email: string; password: string; username: string }) {
    const response = await axios.post(`${USER_SERVICE_URL}/`, userData);
    return response.data;
  },

  async findUserById(userId: string) {
    const response = await axios.get(`${USER_SERVICE_URL}/users/${userId}`);
    return response.data;
  },

  async updateUserPassword(userId: string, newPassword: string) {
    const response = await axios.patch(`${USER_SERVICE_URL}/users/${userId}/password`, { password: newPassword });
    return response.data;
  }
};

export default userService;