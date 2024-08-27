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
  phoneNumber: string;
  // Add other user properties as needed
}

interface SessionStore {
  user: User | null;
  setUser: (user: User | null) => void;
  signIn: (data: { phoneNumber: string; password: string }) => Promise<User>;
  fetchCurrentUser: () => Promise<User>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;

  isLoading: boolean;
  error: string | null;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

const useSession = create<SessionStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      setIsLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setUser: (user) => set({ user }),
      signIn: async (data): Promise<User> => {
        try {
          const response = await axios.post(API_URL.AUTH.login, {
            phoneNumber: data.phoneNumber,
            password: data.password
          });          
          
          const { accessToken, refreshToken, user } = response.data;
          console.log(accessToken);
          

          Cookies.set('access_token', accessToken, { expires: 1 });
          Cookies.set('refresh_token', refreshToken, { expires: 7 });

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

          const userData = response.data;

          set({ user: userData });
          return userData;
        } catch (error) {
          console.error("Fetch current user error:", error);
          await get().refreshToken();
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
      },
      refreshToken: async (): Promise<void> => {
        try {
          const refreshToken = Cookies.get('refresh_token');
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          const response = await axios.post(API_URL.AUTH.refreshToken, {
            refresh_token: refreshToken
          });

          const { access_token, refresh_token } = response.data;

          Cookies.set('access_token', access_token, { expires: 1 });
          Cookies.set('refresh_token', refresh_token, { expires: 7 });
        } catch (error) {
          console.error("Refresh token error:", error);
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          set({ user: null });
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