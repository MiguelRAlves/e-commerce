import { Request, Response } from "express";
import { getProductsById } from "../../services/productServices";

export const getProductsByIdController = async (req: Request, res: Response) => {
    try{
        const product = await getProductsById(Number(req.params.id));
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar o produto' });
    }
}