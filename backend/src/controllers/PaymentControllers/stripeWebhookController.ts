import { Request, Response } from "express";
import Stripe from "stripe";
import { stripe } from "../../lib/stripe";
import { prisma } from "../../lib/prisma";
import { sendOrderConfirmationEmail } from "../../services/emailService";


const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const stripeWebhookController = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err: any) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status === "paid") {
      const orderId = Number(session.metadata?.orderId);

      if (orderId) {
        await prisma.order.update({
          where: { id: orderId },
          data: { status: "paid" },
        });
      }
    }
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const orderId = Number(paymentIntent.metadata?.orderId);

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: "paid" },
      include: {
        orderItems: { include: { product: true } },
        user: true,
      },
    });

    for (const item of order.orderItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: item.quantity },
        },
      });
    }

    await sendOrderConfirmationEmail(order);
  }

  res.json({ received: true });
};