import { prisma } from "../../lib/prisma";

export const getUserOrders = async (userId: number) => {
    const orders = await prisma.order.findMany({
        where: { userId },
        include: {
            orderItems: {
                include: { product: true }
            },
            Payment: true
        },
        orderBy: { createdAt: 'desc' }
    });

    return orders;
}