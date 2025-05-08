import { prisma } from "../../lib/prisma";

export const cancelOrder = async (orderId: number, userId: number) => {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });
  
    if (!order) {
      throw new Error("Pedido não encontrado");
    }
  
    if (order.userId !== userId) {
      throw new Error("Você não tem permissão para cancelar este pedido");
    }
  
    if (order.status !== "pending") {
      throw new Error("Apenas pedidos pendentes podem ser cancelados");
    }
  
    const cancelledOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: "cancelled" },
    });
  
    return cancelledOrder;
  };