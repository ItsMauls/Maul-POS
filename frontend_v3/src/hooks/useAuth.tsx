import { create } from "zustand";
import Cookies from 'js-cookie';
import axios from "axios";
import { login } from "@/services/auth";
import { API_URL } from "@/constants/api";


const useAuth = create((set) => ({
    user: null,
    signIn: async (data : any): Promise<void> => {
        const payload = {
          phone_number : Number(data.phone_number) as number,
          password : data.password
        }
        console.log(payload);
        
        const session = await login(payload)

        Cookies.set('access_token', session.data.data.access_token, { expires: 1 }); // Kedaluwarsa dalam 1 hari
        Cookies.set('refresh_token', session.data.data.refresh_token, { expires: 7 }); // Kedaluwarsa dalam 7 hari
        
        set({ user: session.data.data.user });
        
        return session.data.data
    },
    fetchCurrentUser: async (): Promise<void> => {
      try {
        const accessToken = Cookies.get('access_token')
        const response = await axios.get(
          API_URL.AUTH.currentUser, {
            headers : {
                Authorization : `Bearer ${accessToken}`
            }
          }
        );
  
        const userData = response.data.data;
  
        set({ user: userData });
        return userData
      } catch (error: unknown) {
        // Handle authentication errors
        throw error
      }
    },
    logout: async() => {
        const accessToken = Cookies.get('access_token')
        
        await axios.post(
            API_URL.AUTH.logout, {}, {
              headers : {
                  Authorization : `Bearer ${accessToken}`
              }
            }
        );

        Cookies.remove('access_token')
        Cookies.remove('refresh_token')    
    }
  }));

  export default useAuth;