import { Response } from "express";
import { updateCartItemQuantity } from "../../services/cartServices";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";

export const updateCartItemQuantityController = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;
    const productId = Number(req.params.productId);
    const { quantity } = req.body;

    if (!quantity) {
        res.status(400).json({ error: "É necessário informar quantidade maior que zero" });
        return;
    }

    try {
        const updatedItem = await updateCartItemQuantity(userId, productId, quantity);
        res.status(200).json(updatedItem.quantity);
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Erro ao atualizar quantidade do item do carrinho" });
    }
}