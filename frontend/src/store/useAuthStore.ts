import { create } from 'zustand';
import type { CartItem } from '../types/CartItem';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: (setCart?: (items: CartItem[]) => void) => void;
}

const useAuthStore = create<AuthState>((set) => {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  return {
    token,
    user,
    setToken: (token) => {
      localStorage.setItem("token", token);
      set({ token });
    },
    setUser: (user) => {
      localStorage.setItem("user", JSON.stringify(user));
      set({ user });
    },
    logout: (setCart) => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (setCart) setCart([]);
      set({ token: null, user: null });
    },
  };
});

export default useAuthStore;
