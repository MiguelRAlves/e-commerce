import { prisma } from "../lib/prisma";
import * as cartService from "../services/cartServices";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    cartItem: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}));

const mockedPrisma = prisma as jest.Mocked<typeof prisma>;

describe("cartService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getUserCartItems", () => {
    it("deve retornar os itens do carrinho do usuário", async () => {
      const mockCartItems = [{ id: 1, productId: 1, quantity: 2, product: { name: "Produto" } }];
      // @ts-ignore
      mockedPrisma.cartItem.findMany.mockResolvedValue(mockCartItems as any);

      const result = await cartService.getUserCartItems(1);
      expect(result).toEqual(mockCartItems);
    });

    it("deve lançar erro se o carrinho estiver vazio", async () => {
      // @ts-ignore
      mockedPrisma.cartItem.findMany.mockResolvedValue([]);

      await expect(cartService.getUserCartItems(1)).rejects.toThrow("Carrinho vazio");
    });
  });

  describe("addItemToCart", () => {
    it("deve adicionar novo item se ele não existir", async () => {
      // @ts-ignore
      mockedPrisma.cartItem.findFirst.mockResolvedValue(null);
      // @ts-ignore
      mockedPrisma.cartItem.create.mockResolvedValue({ id: 1 });

      const result = await cartService.addItemToCart(1, 1, 2);
      expect(mockedPrisma.cartItem.create).toHaveBeenCalled();
      expect(result).toEqual({ id: 1 });
    });

    it("deve atualizar quantidade se o item já existir", async () => {
      // @ts-ignore
      mockedPrisma.cartItem.findFirst.mockResolvedValue({ id: 1, quantity: 2 });
      // @ts-ignore
      mockedPrisma.cartItem.update.mockResolvedValue({ id: 1 });

      const result = await cartService.addItemToCart(1, 1, 3);
      expect(mockedPrisma.cartItem.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { quantity: 5 }
      });
      expect(result).toEqual({ id: 1 });
    });

    it("deve lançar erro se quantidade for menor que 1", async () => {
      await expect(cartService.addItemToCart(1, 1, 0)).rejects.toThrow("A quantidade deve ser pelo menos 1");
    });
  });

  describe("updateCartItemQuantity", () => {
    it("deve atualizar a quantidade de um item existente", async () => {
      // @ts-ignore
      mockedPrisma.cartItem.findFirst.mockResolvedValue({ id: 1 });
      // @ts-ignore
      mockedPrisma.cartItem.update.mockResolvedValue({ id: 1, quantity: 5 });
  
      const result = await cartService.updateCartItemQuantity(1, 1, 5);
  
      expect(mockedPrisma.cartItem.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { quantity: 5 }
      });
      expect(result).toEqual({ id: 1, quantity: 5 });
    });
  
    it("deve lançar erro se item não for encontrado", async () => {
      // @ts-ignore
      mockedPrisma.cartItem.findFirst.mockResolvedValue(null);
  
      await expect(cartService.updateCartItemQuantity(1, 1, 5)).rejects.toThrow("Item do carrinho não encontrado");
    });
  
    it("deve lançar erro se quantidade for menor que 1", async () => {
      await expect(cartService.updateCartItemQuantity(1, 1, 0)).rejects.toThrow("A quantidade deve ser pelo menos 1");
    });
  });
  
  describe("removeItemFromCart", () => {
    it("deve remover o item do carrinho", async () => {
      // @ts-ignore
      mockedPrisma.cartItem.findFirst.mockResolvedValue({ id: 1 });
      // @ts-ignore
      mockedPrisma.cartItem.delete.mockResolvedValue({ id: 1 });
  
      await cartService.removeItemFromCart(1, 1);
  
      expect(mockedPrisma.cartItem.delete).toHaveBeenCalledWith({
        where: { id: 1 }
      });
    });
  
    it("deve lançar erro se item não for encontrado", async () => {
      // @ts-ignore
      mockedPrisma.cartItem.findFirst.mockResolvedValue(null);
  
      await expect(cartService.removeItemFromCart(1, 1)).rejects.toThrow("Item do carrinho não encontrado");
    });
  });
  
  describe("clearUserCart", () => {
    it("deve remover todos os itens do carrinho do usuário", async () => {
      // @ts-ignore
      mockedPrisma.cartItem.deleteMany.mockResolvedValue({ count: 3 });
  
      await cartService.clearUserCart(1);
  
      expect(mockedPrisma.cartItem.deleteMany).toHaveBeenCalledWith({
        where: { userId: 1 }
      });
    });
  });  
});
