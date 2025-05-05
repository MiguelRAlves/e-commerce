import { Request, Response } from "express";
import { deleteProduct } from "../../services/productServices";

export const deleteProductController = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await deleteProduct(Number(id));
        res.status(200).json({ message: 'Produto removido com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar o produto' });
    }
}