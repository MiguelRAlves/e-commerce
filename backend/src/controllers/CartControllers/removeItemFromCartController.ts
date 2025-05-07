import { Response } from "express";
import { removeItemFromCart } from "../../services/cartServices";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";

export const removeItemFromCartController = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;
    const productId = Number(req.params.productId);

    try {
        await removeItemFromCart(userId, productId);
        res.status(200).json({ message: "Item removido do carrinho com sucesso" });
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Erro ao remover item do carrinho" });
    }
}