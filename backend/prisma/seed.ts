// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const electronics = await prisma.category.create({
    data: { name: 'Eletrônicos' },
  });

  const clothing = await prisma.category.create({
    data: { name: 'Roupas' },
  });

  await prisma.product.createMany({
    data: [
      {
        name: 'Fone Bluetooth',
        description: 'Fone de ouvido sem fio com alta qualidade.',
        price: 199.99,
        stock: 30,
        imageUrl: 'https://via.placeholder.com/150',
        categoryId: electronics.id,
      },
      {
        name: 'Smartphone',
        description: 'Smartphone com tela de 6 polegadas.',
        price: 999.99,
        stock: 20,
        imageUrl: 'https://via.placeholder.com/150',
        categoryId: electronics.id,
      },
      {
        name: 'Camisa Polo',
        description: 'Camisa polo básica masculina.',
        price: 79.90,
        stock: 50,
        imageUrl: 'https://via.placeholder.com/150',
        categoryId: clothing.id,
      },
      {
        name: 'Calça Jeans',
        description: 'Calça jeans masculino.',
        price: 89.90,
        stock: 40,
        imageUrl: 'https://via.placeholder.com/150',
        categoryId: clothing.id,
      },
    ],
  });

  // Usuário admin
  await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@email.com',
      password: '123456', // hashear isso em produção
      isAdmin: true,
    },
  });

  console.log('Seed realizado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });

