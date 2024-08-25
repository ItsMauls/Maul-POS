import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from 'js-cookie';
import axios from "axios";
import { API_URL } from "@/constants/api";

interface User {
  id: number;
  username: string;
  role: string;
  email: string;
  phone_number: string;
  // Add other user properties as needed
}

interface SessionStore {
  user: User | null;
  setUser: (user: User | null) => void;
  signIn: (data: { phone_number: string; password: string }) => Promise<User>;
  fetchCurrentUser: () => Promise<User>;
  logout: () => Promise<void>;
}

const useSession = create<SessionStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      signIn: async (data): Promise<User> => {
        try {
          const response = await axios.post(API_URL.AUTH.login, {
            phone_number: data.phone_number,
            password: data.password
          });

          const { access_token, refresh_token, user } = response.data.data;

          Cookies.set('access_token', access_token, { expires: 1 });
          Cookies.set('refresh_token', refresh_token, { expires: 7 });

          set({ user });
          return user;
        } catch (error) {
          console.error("Sign in error:", error);
          throw error;
        }
      },
      fetchCurrentUser: async (): Promise<User> => {
        try {
          const accessToken = Cookies.get('access_token');
          
          const response = await axios.get(API_URL.USER.currentUser, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });

          console.log("User data response:", response.data); // Debug log

          const userData = response.data;

          set({ user: userData });
          return userData;
        } catch (error) {
          console.error("Fetch current user error:", error);
          set({ user: null });
          throw error;
        }
      },
      logout: async (): Promise<void> => {
        try {
          const accessToken = Cookies.get('access_token');
          await axios.post(API_URL.AUTH.logout, {}, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });

          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          set({ user: null });
        } catch (error) {
          console.error("Logout error:", error);
          throw error;
        }
      }
    }),
    {
      name: 'user-storage',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);

export default useSession;