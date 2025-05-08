import { prisma } from "../../lib/prisma";

export const getOrderDetails = async (orderId: number) => {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            orderItems: {
                include: { product: true }
            },
            Payment: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            }
        }
    });

    if (!order) throw new Error('Pedido não encontrado');
    return order;
}