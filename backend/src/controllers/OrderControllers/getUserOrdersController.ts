import { Response } from "express";
import { getUserOrders } from "../../services/OrderServices/getUserOrdersService";
import { AuthenticatedRequest } from "@/types/AuthenticatedRequest";

export const getUserOrdersController = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user!.id
        const orders = await getUserOrders(userId)
        res.status(200).json(orders);
    } catch(error:any){
        res.status(500).json({ error: error.message || "Erro ao buscar pedidos do usuário"})
    }
}