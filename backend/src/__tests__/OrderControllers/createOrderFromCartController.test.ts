import { createOrderFromCartController } from "@/controllers/OrderControllers/createOrderFromCartController";
import { createOrderFromCart } from "@/services/OrderServices/createOrderFromCartService";

jest.mock("@/services/OrderServices/createOrderFromCartService");

describe("createOrderFromCartController", () => {
  const req: any = { user: { id: 1 } };
  const res: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  it("deve retornar 201 com o pedido criado", async () => {
    const fakeOrder = { id: 1, total: 100 };
    (createOrderFromCart as jest.Mock).mockResolvedValue(fakeOrder);

    await createOrderFromCartController(req, res);

    expect(createOrderFromCart).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(fakeOrder);
  });

  it("deve retornar 500 em caso de erro", async () => {
    (createOrderFromCart as jest.Mock).mockRejectedValue(new Error("Erro"));

    await createOrderFromCartController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro" });
  });
});
