import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

// Убедитесь, что создается только один экземпляр PrismaClient в режиме разработки
const prismaClientSingleton = () => new PrismaClient();

const db = globalThis.prisma ?? prismaClientSingleton();

// В режиме разработки сохраняем экземпляр в глобальную переменную для предотвращения утечек памяти
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

export default db;
