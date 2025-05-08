import { getOrderDetailsController } from "@/controllers/OrderControllers/getOrderDetailsController";
import { getOrderDetails } from "@/services/OrderServices/getOrderDetailsService";

jest.mock("@/services/OrderServices/getOrderDetailsService");

describe("getOrderDetailsController", () => {
  const res: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  it("deve retornar 200 com os detalhes do pedido", async () => {
    const req: any = { params: { orderId: "1" } };
    const fakeOrder = { id: 1 };
    (getOrderDetails as jest.Mock).mockResolvedValue(fakeOrder);

    await getOrderDetailsController(req, res);

    expect(getOrderDetails).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeOrder);
  });

  it("deve retornar 400 se o orderId for inválido", async () => {
    const req: any = { params: { orderId: "" } };

    await getOrderDetailsController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "ID do pedido inválido" });
  });

  it("deve retornar 500 em caso de erro", async () => {
    const req: any = { params: { orderId: "1" } };
    (getOrderDetails as jest.Mock).mockRejectedValue(new Error("Erro"));

    await getOrderDetailsController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro" });
  });
});