import { Response } from "express";
import { addItemToCart } from "../../services/cartServices";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";

export const addItemToCartController = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { quantity } = req.body;
  const productId = Number(req.params.productId);

  if(!productId || !quantity) {
    res.status(400).json({ error: "É necessário informar o id do produto e a quantidade" });
    return;
  }

  try {
    const cartItem = await addItemToCart(userId, productId, quantity);
    res.status(201).json({ message: "Item adicionado ao carrinho com sucesso", cartItem });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Erro ao adicionar item ao carrinho" });
  }
};
