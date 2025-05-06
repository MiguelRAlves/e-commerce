import { createProductController } from "../../controllers/ProductControllers/createProductController";
import * as productServices from "../../services/productServices";
import { Request, Response } from "express";

describe('createProductController', () => {
    const validProduct = {
        name: 'Notebook',
        description: 'Descrição',
        price: 3499.99,
        stock: 10,
        imageUrl: 'https://example.com',
        categoryId: 1
    };

    const createdProduct = {
        ...validProduct,
        id: 3,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    it('deve criar um produto e retornar status 201', async () => {
        jest.spyOn(productServices, 'createProduct').mockResolvedValue(createdProduct);

        const req = { body: validProduct } as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        await createProductController(req, res);

        expect(productServices.createProduct).toHaveBeenCalledWith(
            validProduct.name,
            validProduct.description,
            validProduct.price,
            validProduct.stock,
            validProduct.imageUrl,
            validProduct.categoryId
        );

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Produto criado com sucesso',
            product: createdProduct
        });
    });

    it('deve retornar 400 se faltar algum campo', async () => {
        const req = {
            body: { name: 'Produto incompleto' }
        } as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        await createProductController(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Todos os campos são obrigatórios' });
    });

    it('deve retornar 500 em caso de erro interno', async () => {
        jest.spyOn(productServices, 'createProduct').mockRejectedValue(new Error('Erro ao criar'));

        const req = { body: validProduct } as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        await createProductController(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Ocorreu um erro ao criar o produto" });
    });
});
