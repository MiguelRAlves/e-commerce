import { createOrderFromCart } from "@/services/OrderServices/createOrderFromCartService";
import { prisma } from "@/lib/prisma";

// Mock do Prisma Client
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

describe("createOrderFromCart", () => {
  const mockedPrisma = prisma as jest.Mocked<typeof prisma>;
  const userId = 1;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve lançar erro se o carrinho estiver vazio", async () => {
    // @ts-ignore
    mockedPrisma.cartItem.findMany.mockResolvedValue([]);

    await expect(createOrderFromCart(userId)).rejects.toThrow("Carrinho vazio");
    expect(mockedPrisma.order.create).not.toHaveBeenCalled();
  });

  it("deve criar um pedido com os itens do carrinho e limpar o carrinho", async () => {
    const cartItems = [
      {
        id: 1,
        userId,
        productId: 1,
        quantity: 2,
        product: {
          id: 1,
          price: 10,
        },
      },
      {
        id: 2,
        userId,
        productId: 2,
        quantity: 1,
        product: {
          id: 2,
          price: 20,
        },
      },
    ];

    const expectedTotal = 2 * 10 + 1 * 20; // 40
    // @ts-ignore
    mockedPrisma.cartItem.findMany.mockResolvedValue(cartItems as any);
    // @ts-ignore
    mockedPrisma.order.create.mockResolvedValue({
      id: 1,
      userId,
      total: expectedTotal,
      status: "pending",
      orderItems: [],
      createdAt: new Date(),
    } as any);

    // @ts-ignore
    mockedPrisma.cartItem.deleteMany.mockResolvedValue({ count: 2 });

    const result = await createOrderFromCart(userId);

    expect(mockedPrisma.cartItem.findMany).toHaveBeenCalledWith({
      where: { userId },
      include: { product: true },
    });

    expect(mockedPrisma.order.create).toHaveBeenCalledWith({
      data: {
        userId,
        total: expectedTotal,
        orderItems: {
          create: [
            { productId: 1, quantity: 2, unitPrice: 10 },
            { productId: 2, quantity: 1, unitPrice: 20 },
          ],
        },
      },
      include: { orderItems: true },
    });

    expect(mockedPrisma.cartItem.deleteMany).toHaveBeenCalledWith({
      where: { userId },
    });

    expect(result.total).toBe(expectedTotal);
  });
});
