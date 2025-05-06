import { deleteProductController } from "../../controllers/ProductControllers/deleteProductController";
import * as productServices from "../../services/productServices";
import { Request, Response } from "express";

describe("deleteProductController", () => {
  const mockRequest = (params = {}) => ({
    params,
  }) as unknown as Request;

  const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn();
    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve deletar o produto e retornar status 200", async () => {
    const req = mockRequest({ id: "1" });
    const res = mockResponse();

    jest.spyOn(productServices, "deleteProduct").mockResolvedValue({
        id: 1,
        name: 'Produto 1',
        description: 'Descrição',
        price: 100,
        stock: 10,
        imageUrl: 'https://example.com',
        categoryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    await deleteProductController(req, res);

    expect(productServices.deleteProduct).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Produto removido com sucesso" });
  });

  it("deve retornar erro 500 se falhar ao deletar", async () => {
    const req = mockRequest({ id: "1" });
    const res = mockResponse();

    jest.spyOn(productServices, "deleteProduct").mockRejectedValue(new Error("Erro ao deletar"));

    await deleteProductController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro ao deletar o produto" });
  });
});