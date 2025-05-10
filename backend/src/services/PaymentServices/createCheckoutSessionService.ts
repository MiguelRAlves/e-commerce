import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

export const createCheckoutSession = async (orderId: number, userId: number) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderItems: { include: { product: true } }
    }
  });

  if (!order) throw new Error("Pedido não encontrado");
  if (order.userId !== userId) throw new Error("Você não tem permissão para pagar este pedido");

  const line_items = order.orderItems.map(item => ({
    price_data: {
      currency: 'brl',
      product_data: { name: item.product.name },
      unit_amount: Math.round(item.product.price * 100),
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card', 'boleto'],
    mode: 'payment',
    line_items,
    payment_intent_data: {
      metadata: {
        orderId: order.id.toString(),
      },
    },
    success_url: `http://localhost:4000/success?orderId=${order.id}`,
    cancel_url: `http://localhost:4000/cancel?orderId=${order.id}`,
  });

  return session.url;
};  