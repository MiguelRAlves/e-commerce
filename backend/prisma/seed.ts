// prisma/seed.ts
import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcrypt';
import { hash } from 'crypto';

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

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
        imageUrl: 'https://cdn.shoppub.io/cdn-cgi/image/w=1000,h=1000,q=80,f=auto/oficinadosbits/media/uploads/produtos/foto/xbjbxtnx/file.png',
        categoryId: electronics.id,
      },
      {
        name: 'Smartphone',
        description: 'Smartphone com tela de 6 polegadas.',
        price: 999.99,
        stock: 20,
        imageUrl: 'https://images.kabum.com.br/produtos/fotos/sync_mirakl/533440/Celular-Samsung-Galaxy-S24-128GB-8GB-RAM-Tela-6-2-Polegadas-Galaxy-Ai-Creme_1719502465_g.jpg',
        categoryId: electronics.id,
      },
      {
        name: 'Camisa Polo',
        description: 'Camisa polo básica masculina.',
        price: 79.90,
        stock: 50,
        imageUrl: 'https://58532.cdn.simplo7.net/static/58532/sku/masculino-camisas-polo-camisa-polo-tradicional--p-0349-1606916620225.jpeg',
        categoryId: clothing.id,
      },
      {
        name: 'Calça Jeans',
        description: 'Calça jeans masculina.',
        price: 89.90,
        stock: 40,
        imageUrl: 'https://static.camisariafmw.com.br/produtograde/20230914115132_2540997460_GZ.jpg',
        categoryId: clothing.id,
      },
    ],
  });

  // Usuário admin
  await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@email.com',
      password: hashedPassword, // hashear isso em produção
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