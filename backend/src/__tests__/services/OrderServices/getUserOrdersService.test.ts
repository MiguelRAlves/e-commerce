import { getUserOrders } from "@/services/OrderServices/getUserOrdersService";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    order: {
      findMany: jest.fn(),
    },
  },
}));

describe("getUserOrders", () => {
  const userId = 1;

  it("deve retornar a lista de pedidos do usuário", async () => {
    const fakeOrders = [
      {
        id: 1,
        userId,
        total: 100,
        status: "pending",
        createdAt: new Date(),
        orderItems: [],
        Payment: [],
      },
    ];

    (prisma.order.findMany as jest.Mock).mockResolvedValue(fakeOrders);

    const result = await getUserOrders(userId);

    expect(prisma.order.findMany).toHaveBeenCalledWith({
      where: { userId },
      include: {
        orderItems: { include: { product: true } },
        Payment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    expect(result).toEqual(fakeOrders);
  });
});
