import { prisma } from "../../lib/prisma";

export const getUserOrderHistory = async (userId: number) => {
    const userOrderHistory = await prisma.order.findMany({
        where: { userId },
        include: { orderItems: { include: { product: true } } },
        orderBy: { createdAt: "desc" }
    })

    if (!userOrderHistory || userOrderHistory.length === 0) throw new Error("Nenhuma compra encontrada");

    return userOrderHistory
};