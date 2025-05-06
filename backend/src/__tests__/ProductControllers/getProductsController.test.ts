import { getProductsController } from "../../controllers/ProductControllers/getProductsController";
import { Request, Response } from "express";
import * as productServices from "../../services/productServices";

describe('getProductsController', () => {
    it('deve retornar lista de produtos com status 200', async () => {
        const mockProducts = [{
            id: 1,
            name: "Produto 1",
            description: "Descrição 1",
            price: 100,
            stock: 10,
            imageUrl: "https://example.com/image.jpg",
            categoryId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            category: {
              id: 1,
              name: "Categoria 1"
            }
          },
        {
            id: 2,
            name: 'Smartphone',
            description: 'Smartphone com tela de 6 polegadas.',
            price: 999.99,
            stock: 20,
            imageUrl: 'https://images.kabum.com.br/produtos/fotos/sync_mirakl/533440/Celular-Samsung-Galaxy-S24-128GB-8GB-RAM-Tela-6-2-Polegadas-Galaxy-Ai-Creme_1719502465_g.jpg',
            categoryId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            category: { id: 1, name: 'Eletrônicos' }
        }
        ] as unknown as ReturnType<typeof productServices.getProducts>;
        
        jest.spyOn(productServices, 'getProducts').mockResolvedValue(mockProducts);

        const req = {} as Request;
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        } as Partial<Response>;

        await getProductsController(req, res as Response);

        expect(res.json).toHaveBeenCalledWith(mockProducts);
    });

    it('deve retornar erro 500 se houver falha', async () => {
        jest.spyOn(productServices, 'getProducts').mockRejectedValue(new Error('Erro interno'));

        const req = {} as Request;
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        } as Partial<Response>;

        await getProductsController(req, res as Response);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao buscar produtos' });
    });
});