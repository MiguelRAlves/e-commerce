import { cancelOrder } from "@/services/OrderServices/cancelOrderService";
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


describe("cancelOrder", () => {
    const mockedPrisma = prisma as jest.Mocked<typeof prisma>;
    const userId = 1;
    const orderId = 42;

    it("deve cancelar o pedido com status 'pending' do usuário", async () => {
        const fakeOrder = { id: orderId, userId, status: "pending" };
        // @ts-ignore
        mockedPrisma.order.findUnique.mockResolvedValue(fakeOrder as any);
        // @ts-ignore
        mockedPrisma.order.update.mockResolvedValue({
            ...fakeOrder,
            status: "cancelled",
        } as any);

        const result = await cancelOrder(orderId, userId);

        expect(mockedPrisma.order.findUnique).toHaveBeenCalledWith({ where: { id: orderId } });
        expect(mockedPrisma.order.update).toHaveBeenCalledWith({
            where: { id: orderId },
            data: { status: "cancelled" },
        });

        expect(result.status).toBe("cancelled");
    });

    it("deve lançar erro se o pedido não existir", async () => {
        // @ts-ignore
        mockedPrisma.order.findUnique.mockResolvedValue(null);

        await expect(cancelOrder(orderId, userId)).rejects.toThrow("Pedido não encontrado");
    });

    it("deve lançar erro se o pedido pertencer a outro usuário", async () => {
        // @ts-ignore
        mockedPrisma.order.findUnique.mockResolvedValue({ id: orderId, userId: 2, status: "pending" } as any);

        await expect(cancelOrder(orderId, userId)).rejects.toThrow("Você não tem permissão para cancelar este pedido");
    });

    it("deve lançar erro se o status não for 'pending'", async () => {
        // @ts-ignore
        mockedPrisma.order.findUnique.mockResolvedValue({ id: orderId, userId, status: "completed" } as any);

        await expect(cancelOrder(orderId, userId)).rejects.toThrow("Apenas pedidos pendentes podem ser cancelados");
    });
});