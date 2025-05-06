import { prisma } from "../lib/prisma";

const getProducts = async () => {
    const products = await prisma.product.findMany({
        include: {
            category: true
        }
    });
    if(!products || products.length === 0) throw new Error('Não há produtos no estoque');
    return products;
}

const getProductsById = async (id: number) => {
    const product = await prisma.product.findUnique({
        where: {
            id
        },
        include: {
            category: true
        }
    });
    if (!product) throw new Error('Produto não encontrado');
    return product;
}

const createProduct = async (name: string, description: string, price: number, stock: number, imageUrl: string, categoryId: number) => {
    return await prisma.product.create({
        data: {
            name,
            description,
            price,
            stock,
            imageUrl,
            categoryId
        }
    });
}

const updateProduct = async (id:number, data: Partial<{ name: string, description: string, price: number, stock: number, imageUrl: string, categoryId: number }>) => {
    const verifyIfProductExists = await prisma.product.findUnique({
        where: {
            id
        }
    });
    if (!verifyIfProductExists) throw new Error('Produto não encontrado');
    
    return await prisma.product.update({ where: { id }, data})
}

const deleteProduct = async (id: number) => {
    const verifyIfProductExists = await prisma.product.findUnique({
        where: {
            id
        }
    });
    if (!verifyIfProductExists) throw new Error('Produto não encontrado');

    return await prisma.product.delete({ where: { id } });
}

export { getProducts, getProductsById, createProduct, updateProduct, deleteProduct };