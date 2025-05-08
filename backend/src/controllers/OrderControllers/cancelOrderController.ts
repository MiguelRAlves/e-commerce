import { Response } from "express";
import { cancelOrder } from "../../services/OrderServices/cancelOrderService";
import { AuthenticatedRequest } from "@/types/AuthenticatedRequest";

export const cancelOrderController = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const orderId = Number(req.params.orderId);

  if (!orderId) {
    res.status(400).json({ error: "ID do pedido é obrigatório" });
    return;
  }

  try {
    const order = await cancelOrder(orderId, userId);
    res.status(200).json({ message: "Pedido cancelado com sucesso", order });
    return
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Erro ao cancelar o pedido" });
    return
  }
};