// src/services/cartService.ts
import { prisma } from "../lib/prisma";

const getUserCartItems = async (userId: number) => {
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true }
  });

  return cartItems;
};

const addItemToCart = async (userId: number, productId: number, quantity: number) => {
  if (quantity < 1) throw new Error("A quantidade deve ser pelo menos 1");

  const quantityInStock = await prisma.product.findUnique({
    where: { id: productId },
    select: { stock: true }
  });
  if (!quantityInStock || quantityInStock.stock < quantity) {
    throw new Error("Quantidade indisponível");
  }

  const existingItem = await prisma.cartItem.findFirst({
    where: { userId, productId }
  });

  if (existingItem) {
    return prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity }
    });
  }

  return prisma.cartItem.create({
    data: {
      userId,
      productId,
      quantity
    }
  });
};

const updateCartItemQuantity = async (userId: number, productId: number, quantity: number) => {
  if (quantity < 1) throw new Error("A quantidade deve ser pelo menos 1");

  const quantityInStock = await prisma.product.findUnique({
    where: { id: productId },
    select: { stock: true }
  });
  if (!quantityInStock || quantityInStock.stock < quantity) {
    throw new Error("Quantidade indisponível");
  }

  const cartItem = await prisma.cartItem.findFirst({
    where: { userId, productId }
  });

  if (!cartItem) throw new Error("Item do carrinho não encontrado");

  return prisma.cartItem.update({
    where: { id: cartItem.id },
    data: { quantity }
  });
};

const removeItemFromCart = async (userId: number, productId: number) => {
  const cartItem = await prisma.cartItem.findFirst({
    where: { userId, productId }
  });

  if (!cartItem) throw new Error("Item do carrinho não encontrado");

  await prisma.cartItem.delete({
    where: { id: cartItem.id }
  });
};

const clearUserCart = async (userId: number) => {
  await prisma.cartItem.deleteMany({
    where: { userId }
  });
};

export { getUserCartItems, addItemToCart, updateCartItemQuantity, removeItemFromCart, clearUserCart };