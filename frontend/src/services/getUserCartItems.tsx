import api from "./api";
import type { CartItem } from "../types/CartItem";

export const getUserCartItems = async (): Promise<CartItem[]> => {
    try {
        const response = await api.get("/cart/");
        console.log(response);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Erro ao buscar carrinho do usuário:", error.message);
        } else {
            console.error("Erro desconhecido ao buscar carrinho do usuário");
        }
        throw error;
    }
};
