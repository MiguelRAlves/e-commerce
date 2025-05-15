import { createContext } from "react";
import type { CartItem } from "../types/CartItem";


type CartContextType = {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  // Você pode adicionar funções para adicionar/remover/atualizar itens depois
};

export const CartContext = createContext<CartContextType | undefined>(undefined);