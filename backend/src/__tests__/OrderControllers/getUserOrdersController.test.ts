import { getUserOrdersController } from "@/controllers/OrderControllers/getUserOrdersController";
import { getUserOrders } from "@/services/OrderServices/getUserOrdersService";

jest.mock("@/services/OrderServices/getUserOrdersService");

describe("getUserOrdersController", () => {
  const req: any = { user: { id: 1 } };
  const res: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  it("deve retornar 200 com os pedidos", async () => {
    const fakeOrders = [{ id: 1 }, { id: 2 }];
    (getUserOrders as jest.Mock).mockResolvedValue(fakeOrders);

    await getUserOrdersController(req, res);

    expect(getUserOrders).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeOrders);
  });

  it("deve retornar 500 em caso de erro", async () => {
    (getUserOrders as jest.Mock).mockRejectedValue(new Error("Erro"));

    await getUserOrdersController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro" });
  });
});