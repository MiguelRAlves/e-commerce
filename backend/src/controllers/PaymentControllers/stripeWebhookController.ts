// src/controllers/PaymentControllers/stripeWebhookController.ts
import { Request, Response } from "express";
import Stripe from "stripe";
import { stripe } from "../../lib/stripe";
import { prisma } from "../../lib/prisma";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const stripeWebhookController = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err: any) {
    console.log(`⚠️  Webhook signature verification failed.`, err.message);
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

        console.log(`✅ Pedido ${orderId} marcado como pago.`);
      } else {
        console.log("⚠️ Metadata não contém orderId.");
      }
    } else {
      console.log(`⚠️ Sessão concluída mas pagamento não confirmado. Status: ${session.payment_status}`);
    }
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const orderId = Number(paymentIntent.metadata?.orderId);

    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "paid" },
      });

      console.log(`✅ Pedido ${orderId} marcado como pago via PaymentIntent.`);
    } else {
      console.log("⚠️ PaymentIntent sem orderId nos metadados.");
    }
  }

  res.json({ received: true });
};