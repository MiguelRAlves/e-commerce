import { clearUserCartController } from "../../controllers/CartControllers/clearUserCartController";
import * as cartService from "../../services/cartServices";
import { Request, Response } from "express";

jest.mock("../../services/cartServices");

describe("clearUserCartController", () => {
    it("deve limpar o carrinho do usuário com sucesso", async () => {
        // @ts-ignore
        cartService.clearUserCart.mockResolvedValue(null);

        const req = {
            user: { id: 1 },
        } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        await clearUserCartController(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Carrinho limpo com sucesso" });
    });

    it("deve retornar erro se ocorrer erro no serviço", async () => {
        // @ts-ignore
        cartService.clearUserCart.mockRejectedValue(new Error("Erro ao limpar o carrinho"));

        const req = {
            user: { id: 1 },
        } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        await clearUserCartController(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Erro ao limpar o carrinho" });
    });
});