import { updateProductController } from "../../controllers/ProductControllers/updateProductController";
import * as productServices from "../../services/productServices";
import { Request, Response } from "express";

describe("updateProductController", () => {
  const mockRequest = (body = {}, params = {}) => ({
    body,
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

  it("deve retornar erro 400 se body estiver vazio", async () => {
    const req = mockRequest({}, { id: "1" });
    const res = mockResponse();

    await updateProductController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "É necessário enviar ao menos um campo para atualização.",
    });
  });

  it("deve atualizar o produto e retornar 200 com o produto atualizado", async () => {
    const req = mockRequest({ name: "Produto atualizado" }, { id: "1" });
    const res = mockResponse();

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
    jest.spyOn(productServices, "updateProduct").mockResolvedValue(mockProduct);

    await updateProductController(req, res);

    expect(productServices.updateProduct).toHaveBeenCalledWith(1, { name: "Produto atualizado" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockProduct);
  });

  it("deve retornar erro 500 se ocorrer uma exceção", async () => {
    const req = mockRequest({ name: "Produto" }, { id: "1" });
    const res = mockResponse();

    jest.spyOn(productServices, "updateProduct").mockRejectedValue(new Error("Erro inesperado"));

    await updateProductController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro inesperado" });
  });
});
