import { Request, Response } from "express";
import { getProducts } from "../../services/productServices";

export const getProductsController = async (req: Request, res: Response) => {
    try{
        const products = await getProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
}