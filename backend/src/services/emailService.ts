import nodemailer from "nodemailer";
import { Order, OrderItem, Product, User } from "@prisma/client";

interface OrderWithDetails extends Order {
  orderItems: (OrderItem & { product: Product })[];
  user: User;
}

export const sendOrderConfirmationEmail = async (
  order: OrderWithDetails
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const itemRows = order.orderItems
    .map(
      (item) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.product.name}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">R$ ${(item.product.price * item.quantity).toFixed(2)}</td>
      </tr>
    `
    )
    .join("");

  const total = order.orderItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  await transporter.sendMail({
    from: `"E-commerce" <${process.env.EMAIL_FROM}>`,
    to: order.user.email,
    subject: "Confirmação do seu Pedido",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
        <h2 style="color: #4CAF50;">Pedido Confirmado! 🎉</h2>
        <p>Olá, <strong>${order.user.name}</strong>,</p>
        <p>Seu pedido <strong>#${order.id}</strong> foi confirmado com sucesso.</p>

        <h3 style="margin-top: 30px;">Resumo do Pedido</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr>
              <th style="padding: 8px; border: 1px solid #ddd; background: #f9f9f9;">Produto</th>
              <th style="padding: 8px; border: 1px solid #ddd; background: #f9f9f9;">Qtd</th>
              <th style="padding: 8px; border: 1px solid #ddd; background: #f9f9f9;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemRows}
            <tr>
              <td colspan="2" style="padding: 8px; text-align: right; font-weight: bold;">Total:</td>
              <td style="padding: 8px; text-align: right; font-weight: bold;">R$ ${total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <p style="margin-top: 30px;">Agradecemos sua compra! Você receberá atualizações por e-mail assim que o pedido for enviado.</p>

        <p style="margin-top: 40px; font-size: 13px; color: #888;">
          E-commerce rest | Este é um e-mail automático, por favor não responda.
        </p>
      </div>
    `,
  });
};