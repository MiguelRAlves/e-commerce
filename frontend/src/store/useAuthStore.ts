import { create } from 'zustand';
import type { CartItem } from '../types/CartItem';

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  logout: (setCart?: (items: CartItem[]) => void) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("token"),
  setToken: (token) => {
    localStorage.setItem("token", token);
    set({ token });
  },
  logout: (setCart) => {
    localStorage.removeItem("token");
    if (setCart) setCart([]);
    set({ token: null });
  },
}));

export default useAuthStore;
