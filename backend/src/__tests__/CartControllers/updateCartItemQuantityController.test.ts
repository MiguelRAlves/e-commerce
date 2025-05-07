import { updateCartItemQuantityController } from "../../controllers/CartControllers/updateCartItemQuantityController";
import * as cartService from "../../services/cartServices";
import { Request, Response } from "express";

jest.mock("../../services/cartServices");

describe("updateCartItemQuantityController", () => {
    it("deve atualizar a quantidade do item no carrinho com sucesso", async () => {
        const mockUpdatedItem = { quantity: 5 };

        // @ts-ignore
        cartService.updateCartItemQuantity.mockResolvedValue(mockUpdatedItem);

        const req = {
            user: { id: 1 },
            body: { quantity: 5 },
            params: { productId: "1" },
        } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        await updateCartItemQuantityController(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(5);
    });

    it("deve retornar erro se a quantidade for menor que 1", async () => {
        const req = {
            user: { id: 1 },
            body: { quantity: 0 },
            params: { productId: "1" },
        } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        await updateCartItemQuantityController(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "É necessário informar quantidade maior que zero",
        });
    });

    it("deve retornar erro ao atualizar quantidade se ocorrer erro no serviço", async () => {
        // @ts-ignore
        cartService.updateCartItemQuantity.mockRejectedValue(new Error("Erro ao atualizar quantidade do item do carrinho"));

        const req = {
            user: { id: 1 },
            body: { quantity: 5 },
            params: { productId: "1" },
        } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        await updateCartItemQuantityController(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: "Erro ao atualizar quantidade do item do carrinho",
        });
    });
});
