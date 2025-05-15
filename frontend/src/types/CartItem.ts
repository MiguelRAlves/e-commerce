import type { Product } from "./Product";

export type CartItem = {
  id: number;
  productId: number;
  userId: number;
  quantity: number;
  createdAt: string;
  product: Product;
};