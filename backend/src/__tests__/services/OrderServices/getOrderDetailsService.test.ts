import { getOrderDetails } from "@/services/OrderServices/getOrderDetailsService";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
    prisma: {
        order: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
        },
        cartItem: {
            findMany: jest.fn(),
            deleteMany: jest.fn(),
        },
    },
}));

describe("getOrderDetails", () => {
  const mockedPrisma = prisma as jest.Mocked<typeof prisma>;

  it("deve retornar os detalhes do pedido se existir", async () => {
    const orderId = 1;
    const fakeOrder = {
      id: orderId,
      userId: 1,
      user: { id: 1, name: "Miguel", email: "miguel@example.com" },
      orderItems: [],
      Payment: [],
    };
    // @ts-ignore
    mockedPrisma.order.findUnique.mockResolvedValue(fakeOrder as any);

    const result = await getOrderDetails(orderId);

    expect(mockedPrisma.order.findUnique).toHaveBeenCalledWith({
      where: { id: orderId },
      include: {
        orderItems: { include: { product: true } },
        Payment: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    expect(result).toEqual(fakeOrder);
  });

  it("deve lançar erro se o pedido não for encontrado", async () => {
    const orderId = 999;
    // @ts-ignore
    mockedPrisma.order.findUnique.mockResolvedValue(null);

    await expect(getOrderDetails(orderId)).rejects.toThrow("Pedido não encontrado");
  });
});
