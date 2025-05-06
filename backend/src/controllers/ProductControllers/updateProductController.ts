import { Request, Response } from "express";
import { updateProduct } from "../../services/productServices";

export const updateProductController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).json({ error: "É necessário enviar ao menos um campo para atualização." });
    return;
  }

  try {
    const updatedProduct = await updateProduct(Number(id), req.body);
    res.status(200).json(updatedProduct);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Erro ao atualizar o produto." });
  }
};
