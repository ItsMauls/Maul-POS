import axios from 'axios';
import { USER_SERVICE_URL } from '../constants';


const userService = {
  async findUserByEmail(email: string) {
    const response = await axios.get(`${USER_SERVICE_URL}/users/by-email/${email}`);
    return response.data;
  },

  async validateUserCredentials(email: string, password: string) {
    const response = await axios.post(`${USER_SERVICE_URL}/users/validate`, { email, password });
    return response.data;
  }
};

export default userService;