import { Request, Response } from "express";
import { getProducts } from "../services/productService";

export const getProductsController = async (req: Request, res: Response) => {
    try{
        const products = await getProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
}