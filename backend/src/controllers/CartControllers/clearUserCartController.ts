import { Response } from "express";
import { clearUserCart } from "../../services/cartServices";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";

export const clearUserCartController = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;
    try{
        await clearUserCart(userId);
        res.status(200).json({ message: "Carrinho limpo com sucesso" });
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Erro ao limpar o carrinho" });
    }
}