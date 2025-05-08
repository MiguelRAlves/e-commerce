import { Response } from "express";
import { getOrderDetails } from "../../services/OrderServices/getOrderDetailsService";
import { AuthenticatedRequest } from "@/types/AuthenticatedRequest";

export const getOrderDetailsController = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const orderId = Number(req.params.orderId);
        if (!orderId) {
            res.status(400).json({ error: "ID do pedido inválido" });
            return
        }

        const order = await getOrderDetails(orderId);
        res.status(200).json(order);
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Erro ao buscar detalhes do pedido "})
    }
}