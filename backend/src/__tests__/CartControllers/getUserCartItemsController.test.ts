import { getUserCartItemsController } from "../../controllers/CartControllers/getUserCartItemsController";
import { Request, Response } from "express";
import * as cartService from "../../services/cartServices";

jest.mock("../../services/cartServices");

describe("getUserCartItemsController", () => {
    it("deve retornar os itens do carrinho com sucesso", async () => {
        const mockCartItems = [{ id: 1, productId: 1, quantity: 2, product: { name: "Produto" } }];
        
        // @ts-ignore
        cartService.getUserCartItems.mockResolvedValue(mockCartItems);

        const req = { user: { id: 1 } } as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        await getUserCartItemsController(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockCartItems);
    });

    it("deve retornar erro ao buscar carrinho se ocorrer erro no serviço", async () => {
        // @ts-ignore
        cartService.getUserCartItems.mockRejectedValue(new Error("Erro ao buscar carrinho"));

        const req = { user: { id: 1 } } as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        await getUserCartItemsController(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Erro ao buscar carrinho" });
    });
});
