import { getProductsByIdController } from "../../controllers/ProductControllers/getProductsByIdController";
import { Request, Response } from "express";
import * as productServices from "../../services/productServices";

describe('getProductsByIdController', () => {
    it('deve retornar o produto com status 200', async () => {
        const mockProduct = {
            id: 1,
            name: 'Produto 1',
            description: 'Descrição',
            price: 100,
            stock: 10,
            imageUrl: 'https://example.com',
            categoryId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            category: {
                id: 1,
                name: 'Categoria'
            }
        };

        jest.spyOn(productServices, 'getProductsById').mockResolvedValue(mockProduct);

        const req = { params: { id: '1' } } as unknown as Request;
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        } as unknown as Response;

        await getProductsByIdController(req, res);

        expect(productServices.getProductsById).toHaveBeenCalledWith(1);
        expect(res.json).toHaveBeenCalledWith(mockProduct);
    });
    it('deve retornar erro 500 se houver falha', async () => {
        jest.spyOn(productServices, 'getProductsById').mockRejectedValue(new Error('Erro interno'));

        const req = { params: { id: '999' } } as unknown as Request;
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        } as unknown as Response;

        await getProductsByIdController(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao buscar o produto' });
    });
});