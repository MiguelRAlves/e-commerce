import { Response } from "express";
import { createCheckoutSession } from "../../services/PaymentServices/createCheckoutSessionService";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";

export const createCheckoutSessionController = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const orderId = Number(req.params.orderId);

  if (!orderId) {
    res.status(400).json({ error: "ID do pedido é obrigatório" });
    return;
  }

  try {
    const checkoutUrl = await createCheckoutSession(orderId, userId);
    res.status(200).json({ url: checkoutUrl });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Erro ao criar sessão de pagamento" });
  }
};
