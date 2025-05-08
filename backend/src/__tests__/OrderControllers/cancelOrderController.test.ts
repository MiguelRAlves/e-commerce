import { cancelOrderController } from "@/controllers/OrderControllers/cancelOrderController";
import { cancelOrder } from "@/services/OrderServices/cancelOrderService";

jest.mock("@/services/OrderServices/cancelOrderService");

describe("cancelOrderController", () => {
  const res: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  it("deve cancelar o pedido com sucesso", async () => {
    const req: any = { user: { id: 1 }, params: { orderId: "1" } };
    const fakeOrder = { id: 1, status: "cancelled" };
    (cancelOrder as jest.Mock).mockResolvedValue(fakeOrder);

    await cancelOrderController(req, res);

    expect(cancelOrder).toHaveBeenCalledWith(1, 1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Pedido cancelado com sucesso",
      order: fakeOrder
    });
  });

  it("deve retornar 400 se o ID for inválido", async () => {
    const req: any = { user: { id: 1 }, params: { orderId: "" } };

    await cancelOrderController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "ID do pedido é obrigatório" });
  });

  it("deve retornar erro se serviço falhar", async () => {
    const req: any = { user: { id: 1 }, params: { orderId: "1" } };
    (cancelOrder as jest.Mock).mockRejectedValue(new Error("Erro"));

    await cancelOrderController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro" });
  });
});