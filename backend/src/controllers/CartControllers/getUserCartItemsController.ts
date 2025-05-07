import { Response } from "express";
import { getUserCartItems } from "../../services/cartServices"; 
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";

export const getUserCartItemsController = async (req: AuthenticatedRequest, res: Response) => {
    try {
        console.log(req.user!.id);
        const cart = await getUserCartItems(req.user!.id);
        res.status(200).json(cart);
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Erro ao buscar carrinho do usuário" });
    }
}