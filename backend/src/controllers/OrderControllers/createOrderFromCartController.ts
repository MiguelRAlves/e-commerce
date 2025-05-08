import { Response } from "express";
import { createOrderFromCart } from "../../services/OrderServices/createOrderFromCartService";
import { AuthenticatedRequest } from "@/types/AuthenticatedRequest";

export const createOrderFromCartController = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const userId = req.user!.id;
        const order = await createOrderFromCart(userId);
        res.status(201).json(order);
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Erro ao criar pedido" });
    }
}