import { getProducts, getProductsById, createProduct, updateProduct, deleteProduct } from "../services/productServices";
import { prisma } from "../lib/prisma";

jest.mock("@/lib/prisma", () => ({
    prisma: {
        product: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    }
}));

beforeEach(() => {
    jest.clearAllMocks();
});

describe("getProducts", () => {
    const mockProducts = [
        {
            id: 1,
            name: 'Fone Bluetooth',
            description: 'Fone de ouvido sem fio com alta qualidade.',
            price: 199.99,
            stock: 30,
            imageUrl: 'https://cdn.shoppub.io/cdn-cgi/image/w=1000,h=1000,q=80,f=auto/oficinadosbits/media/uploads/produtos/foto/xbjbxtnx/file.png',
            categoryId: 1,
            category: { id: 1, name: 'Eletrônicos' } // caso use include: { category: true }
        },
        {
            id: 2,
            name: 'Smartphone',
            description: 'Smartphone com tela de 6 polegadas.',
            price: 999.99,
            stock: 20,
            imageUrl: 'https://images.kabum.com.br/produtos/fotos/sync_mirakl/533440/Celular-Samsung-Galaxy-S24-128GB-8GB-RAM-Tela-6-2-Polegadas-Galaxy-Ai-Creme_1719502465_g.jpg',
            categoryId: 1,
            category: { id: 1, name: 'Eletrônicos' }
        }
    ];

    it("deve retornar uma lista de produtos", async () => {
        // @ts-ignore
        prisma.product.findMany.mockResolvedValue(mockProducts);

        const result = await getProducts();

        expect(result).toEqual(mockProducts);
        expect(prisma.product.findMany).toHaveBeenCalledWith({
            include: { category: true },
        });
    });

    it("deve lançar um erro se não houver produtos", async () => {
        // @ts-ignore
        prisma.product.findMany.mockResolvedValue([]);

        await expect(getProducts()).rejects.toThrow('Não há produtos no estoque');
    });
});

describe("getProductsById", () => {
    const mockProduct = {
        id: 1,
        name: 'Fone Bluetooth',
        description: 'Fone de ouvido sem fio',
        price: 199.99,
        stock: 30,
        imageUrl: 'https://cdn.shoppub.io/cdn-cgi/image/w=1000,h=1000,q=80,f=auto/oficinadosbits/media/uploads/produtos/foto/xbjbxtnx/file.png',
        categoryId: 1,
        category: { id: 1, name: 'Eletrônicos' }
    };

    it("deve retornar o produto pelo ID", async () => {
        // @ts-ignore
        prisma.product.findUnique.mockResolvedValue(mockProduct);

        const result = await getProductsById(1);

        expect(result).toEqual(mockProduct);
        expect(prisma.product.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
            include: { category: true }
        });
    });

    it("deve lançar um erro se o produto não for encontrado", async () => {
        // @ts-ignore
        prisma.product.findUnique.mockResolvedValue(null);

        await expect(getProductsById(999)).rejects.toThrow('Produto não encontrado');
    });
});

describe("createProduct", () => {
    it("deve criar e retornar um novo produto", async () => {
        const newProduct = {
            id: 3,
            name: 'Notebook',
            description: 'Notebook potente',
            price: 3499.99,
            stock: 15,
            imageUrl: 'https://...',
            categoryId: 1
        };

        // @ts-ignore
        prisma.product.create.mockResolvedValue(newProduct);

        const result = await createProduct(
            newProduct.name,
            newProduct.description,
            newProduct.price,
            newProduct.stock,
            newProduct.imageUrl,
            newProduct.categoryId
        );

        expect(result).toEqual(newProduct);
        expect(prisma.product.create).toHaveBeenCalledWith({
            data: {
                name: newProduct.name,
                description: newProduct.description,
                price: newProduct.price,
                stock: newProduct.stock,
                imageUrl: newProduct.imageUrl,
                categoryId: newProduct.categoryId
            }
        });
    });
});

describe("updateProduct", () => {
    const existingProduct = { id: 1, name: 'Fone Bluetooth' };
    const updatedProduct = { name: 'Fone Bluetooth Atualizado' };

    it("deve atualizar e retornar um produto existente", async () => {
        // @ts-ignore
        prisma.product.findUnique.mockResolvedValue(existingProduct);
        // @ts-ignore
        prisma.product.update.mockResolvedValue({ ...existingProduct, ...updatedProduct });

        const result = await updateProduct(1, updatedProduct);

        expect(result).toEqual({ id: 1, name: 'Fone Bluetooth Atualizado' });
        expect(prisma.product.update).toHaveBeenCalledWith({ where: { id: 1 }, data: updatedProduct });
    });

    it("deve lançar um erro se o produto não existir", async () => {
        // @ts-ignore
        prisma.product.findUnique.mockResolvedValue(null);
        await expect(updateProduct(999, updatedProduct)).rejects.toThrow('Produto não encontrado');
    });
});

describe("deleteProduct", () => {
    const productToDelete = { id: 1, name: 'Fone Bluetooth' };

    it("deve deletar um produto existente", async () => {
        // @ts-ignore
        prisma.product.findUnique.mockResolvedValue(productToDelete);
        // @ts-ignore
        prisma.product.delete.mockResolvedValue(productToDelete);

        const result = await deleteProduct(1);

        expect(result).toEqual(productToDelete);
        expect(prisma.product.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it("deve lançar um erro se o produto não existir", async () => {
        // @ts-ignore
        prisma.product.findUnique.mockResolvedValue(null);
        await expect(deleteProduct(999)).rejects.toThrow('Produto não encontrado');
    });
});