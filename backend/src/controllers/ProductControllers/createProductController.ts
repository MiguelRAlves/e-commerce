import { Request, Response } from "express";
import { createProduct } from "../../services/productServices";

export const createProductController = async (req: Request, res: Response) => {
    try {
        const { name, description, price, stock, imageUrl, categoryId } = req.body;

        if (!name || !description || !price || !stock || !imageUrl || !categoryId) {
           res.status(400).json({ error: 'Todos os campos são obrigatórios' });
           return
        }

        const newProduct = await createProduct(name, description, price, stock, imageUrl, categoryId);
        res.status(201).json({ message: 'Produto criado com sucesso', product: newProduct });

    } catch (error: any) {
        res.status(500).json({ error: 'Ocorreu um erro ao criar o produto' });
    }
}