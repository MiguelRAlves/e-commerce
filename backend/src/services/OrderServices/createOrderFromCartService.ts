import { prisma } from "../../lib/prisma";

export const createOrderFromCart = async (userId: number) => {
    const cartItems = await prisma.cartItem.findMany({
        where: { userId },
        include: { product: true }
    });

    if (!cartItems || cartItems.length === 0) throw new Error("Carrinho vazio");

    const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const order = await prisma.order.create({
        data: {
            userId,
            total,
            orderItems: {
                create: cartItems.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: item.product.price
                })),
            },
        },
        include: { orderItems: true }
    });

    await prisma.cartItem.deleteMany({
        where: { userId }
    });

    return order;
}