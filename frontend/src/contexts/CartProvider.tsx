import React, { useEffect, useState } from "react";
import { getUserCartItems } from "../services/getUserCartItems";
import type { CartItem } from "../types/CartItem";
import { CartContext } from "./CartContext";
import useAuthStore from "../store/useAuthStore";


export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const token = useAuthStore(state => state.token);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const items = await getUserCartItems();
        setCart(items);
      } catch (error) {
        console.error("Erro ao carregar carrinho:", error);
        setCart([]);
      }
    };

    fetchCart();
  }, [token]);

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};