import { addItemToCartController } from "../../controllers/CartControllers/addItemToCartController";
import * as cartService from "../../services/cartServices";
import { Request, Response } from "express";

jest.mock("../../services/cartServices");

describe("addItemToCartController", () => {
    it("deve adicionar item ao carrinho com sucesso", async () => {
        const mockCartItem = { id: 1, quantity: 2 };

        // @ts-ignore
        cartService.addItemToCart.mockResolvedValue(mockCartItem);

        const req = {
            user: { id: 1 },
            body: { quantity: 2 },
            params: { productId: "1" },
        } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        await addItemToCartController(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: "Item adicionado ao carrinho com sucesso",
            cartItem: mockCartItem,
        });
    });

    it("deve retornar erro se falta produto ou quantidade", async () => {
        const req = {
            user: { id: 1 },
            body: {},
            params: { productId: "1" },
        } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        await addItemToCartController(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "É necessário informar o id do produto e a quantidade",
        });
    });

    it("deve retornar erro ao adicionar item se ocorrer erro no serviço", async () => {
        // @ts-ignore
        cartService.addItemToCart.mockRejectedValue(new Error("Erro ao adicionar item ao carrinho"));

        const req = {
            user: { id: 1 },
            body: { quantity: 2 },
            params: { productId: "1" },
        } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        await addItemToCartController(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: "Erro ao adicionar item ao carrinho",
        });
    });
});
