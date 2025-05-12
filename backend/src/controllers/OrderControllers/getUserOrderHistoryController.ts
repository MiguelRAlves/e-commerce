import { Response } from "express";
import { getUserOrderHistory } from "../../services/OrderServices/getUserOrderHistoryService";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";

export const getUserOrderHistoryController = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const orders = await getUserOrderHistory(userId);
        res.status(200).json(orders);
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Erro ao buscar histórico de compras do usuário" });
    }
}