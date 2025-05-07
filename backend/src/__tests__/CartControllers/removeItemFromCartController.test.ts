import { removeItemFromCartController } from "../../controllers/CartControllers/removeItemFromCartController";
import * as cartService from "../../services/cartServices";
import { Request, Response } from "express";

jest.mock("../../services/cartServices");

describe("removeItemFromCartController", () => {
    it("deve remover o item do carrinho com sucesso", async () => {
        // @ts-ignore
        cartService.removeItemFromCart.mockResolvedValue(null);

        const req = {
            user: { id: 1 },
            params: { productId: "1" },
        } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        await removeItemFromCartController(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Item removido do carrinho com sucesso" });
    });

    it("deve retornar erro se ocorrer erro no serviço", async () => {
        // @ts-ignore
        cartService.removeItemFromCart.mockRejectedValue(new Error("Erro ao remover item do carrinho"));

        const req = {
            user: { id: 1 },
            params: { productId: "1" },
        } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        await removeItemFromCartController(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Erro ao remover item do carrinho" });
    });
});