import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProducts = async () => {
    return await prisma.product.findMany({
        include: {
            category: true
        }
    });
}